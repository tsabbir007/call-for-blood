export async function fetchUser(userId: string) {
    const response = await fetch(`/api/user/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    return response.json();
  }
  
  export async function updateUser(userId: string, userData: any) {
    const response = await fetch(`/api/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error('Failed to update user data');
    }
    return response.json();
  }

  export async function deleteUser(userId: string) {
    const response = await fetch(`/api/donors/${userId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete user data');
    }
    return response.json();
  }
  
  