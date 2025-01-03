import axios from "axios";
import { useState, useEffect } from "react";
import { hitpoint } from "../HitPoint";
import { useNavigate } from "react-router-dom";

const GroupPage = () => {
  const nv = useNavigate();
  const [groups, setGroups] = useState<{id: string, name: string, members: number}[]>([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);  // Modal visibility state for Create Group
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);  // Modal visibility state for Join Group
  const [newGroupName, setNewGroupName] = useState("");    // Group name input state for Create Group
  const [groupCode, setGroupCode] = useState("");  // Group code input state for Join Group

  // Handle opening of Create Group modal
  const handleCreateGroupClick = () => {
    setIsCreateModalOpen(true); // Open modal when the button is clicked
  };

  const fetchGroups = async () => {
    
    const token = localStorage.getItem("token");
  if (!token) {
    return;
  }
  try {
    const response = await axios.get(
      hitpoint + "/api/group/viewgroups",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const grps = response.data.groups;
    const g = grps.map((gr : any) => (
      {
        id: gr.groupid,
        name: gr.name,
        members: gr.members.length
      }      
    ));

    setGroups(g);
  } catch (error : any) {
  }
    
  }
  

  const joinGroup = async (id: string) => {
    const token = localStorage.getItem("token");
  if (!token) {
    return;
  }
  try {
    const response = await axios.post(
      hitpoint + "/api/group/join",
      { groupid: id, },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    alert("Group joined!");
    setIsJoinModalOpen(false);

    window.location.reload();
  } catch (error : any) {
    alert("error joining grp");
  }
    
  };
  
  const createGroup = async (value : string) => {
    
    const token = localStorage.getItem("token");
  if (!token) {
    return;
  }
  try {
    const response = await axios.post(
      hitpoint + "/api/group/create",
      {
        name: value
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    alert("group created");
    setIsCreateModalOpen(false);
  } catch (error : any) {
  }
    fetchGroups();    
  }

  useEffect(() => {
    fetchGroups();
  }, []);
  // Handle creating a group
  const handleCreateGroup = () => {
    createGroup(newGroupName);
  };

  // Handle opening of Join Group modal
  const handleJoinGroupClick = () => {
    setIsJoinModalOpen(true); // Open modal when the button is clicked
  };

  // Handle joining a group
  const handleJoinGroup = () => {
    joinGroup(groupCode.trim())
  };

  return (
    <div className="min-h-screen p-4" style={{ height: "100vh", overflow: "hidden" }}>
      <div className="container mx-auto bg-black rounded-4 p-0" style={{ maxWidth: "1000px", height: "100%" }}>
        
        {/* Taskbar-like "Create Group" and "Join Group" buttons */}
        <div className="d-flex justify-content-between align-items-center px-3" style={{ paddingTop: "20px", marginBottom: "20px" }}>
          <button 
            onClick={handleCreateGroupClick}  // Open modal on button click
            className="btn btn-outline-light btn-sm px-6 py-3 w-full rounded-3 hover:bg-white/10 transition-all duration-300">
            Create Group
          </button>
          <button 
            onClick={handleJoinGroupClick}  // Open modal for Join Group
            className="btn btn-outline-light btn-sm px-6 py-3 w-full rounded-3 hover:bg-white/10 transition-all duration-300">
            Join Group
          </button>
        </div>

        {/* "Your Groups" title with bottom margin */}
        <div className="bg-black rounded-4 p-0" style={{ height: "calc(100% - 60px)", overflow: "hidden" }}>
          <h1 className="text-white text-center text-2xl" style={{ marginTop: "20px", marginBottom: "30px" }}>
            Your Groups
          </h1>

          <div style={{ height: "calc(100% - 60px)" }}>
            <div className="overflow-y-auto pb-4">
              {/* Flex container for vertical layout with gap between boxes */}
              <div className="flex flex-col gap-6 px-2">
                {groups.length > 0 ? groups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => { nv(`/group/${group.id}`)}}
                    className="w-full border-2 border-white rounded-lg text-white bg-transparent hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
                    style={{
                      padding: "12px 16px",
                      height: "80px",
                      width: "100%",
                      borderRadius: "15px",
                      marginBottom: "15px",
                    }}
                  >
                    <div className="flex flex-col items-center justify-center w-full">
                      <h3 className="text-sm font-semibold text-center">{group.name}</h3>
                      <p className="text-xs text-gray-400 text-center">{group.members} members</p>
                    </div>
                  </button>
                )) : <div style={{display: "flex", justifyContent: "center"}}><p className="text-secondary">Make frens bitch<br/>Join/Create Group</p></div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Group Modal */}
      {isCreateModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)", display: "flex",
          justifyContent: "center", alignItems: "center", zIndex: 50
        }}>
          <div style={{
            backgroundColor: "black", padding: "20px", borderRadius: "10px",
            width: "80%", maxWidth: "500px", textAlign: "center", border: "2px solid white"
          }}>
            <h2 className="text-white text-xl mb-4">Create a New Group</h2>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full p-3 border-2 border-white rounded-lg mb-8 bg-transparent text-white placeholder-gray-400 focus:outline-none"
              placeholder="Enter group name"
            />
            
            {/* Flex container for side-by-side buttons with a gap and margin */}
            <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginTop: "20px" }}>
              {/* Cancel Button */}
              <button
                onClick={() => setIsCreateModalOpen(false)}  // Close modal without saving
                className="bg-black text-white px-6 py-3 rounded-3 border-2 border-white hover:bg-white/10 transition-all duration-300 w-full">
                Cancel
              </button>

              {/* Create Button */}
              <button
                onClick={handleCreateGroup}  // Create group on click
                className="bg-black text-white px-6 py-3 rounded-3 border-2 border-white hover:bg-white/10 transition-all duration-300 w-full">
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Group Modal */}
      {isJoinModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)", display: "flex",
          justifyContent: "center", alignItems: "center", zIndex: 50
        }}>
          <div style={{
            backgroundColor: "black", padding: "20px", borderRadius: "10px",
            width: "80%", maxWidth: "500px", textAlign: "center", border: "2px solid white"
          }}>
            <h2 className="text-white text-xl mb-4">Join a Group</h2>
            <input
              type="text"
              value={groupCode}
              onChange={(e) => setGroupCode(e.target.value)}
              className="w-full p-3 border-2 border-white rounded-lg mb-8 bg-transparent text-white placeholder-gray-400 focus:outline-none"
              placeholder="Enter group code"
            />
            
            {/* Flex container for side-by-side buttons with a gap and margin */}
            <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginTop: "20px" }}>
              {/* Cancel Button */}
              <button
                onClick={() => setIsJoinModalOpen(false)}  // Close modal without joining
                className="bg-black text-white px-6 py-3 rounded-3 border-2 border-white hover:bg-white/10 transition-all duration-300 w-full">
                Cancel
              </button>

              {/* Join Button */}
              <button
                onClick={handleJoinGroup}  // Join group on click
                className="bg-black text-white px-6 py-3 rounded-3 border-2 border-white hover:bg-white/10 transition-all duration-300 w-full">
                Join
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupPage;