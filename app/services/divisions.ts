export async function fetchDivisions() {
    const response = await fetch('https://bdapis.com/api/v1.2/divisions');
    if (!response.ok) {
      throw new Error('Failed to fetch divisions');
    }
    const data = await response.json();
    return data.data.map((division: any) => division.division);
  }
  
  