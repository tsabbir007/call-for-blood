export async function fetchDistricts(division: string) {
    const response = await fetch(`https://bdapis.com/api/v1.2/division/${division}`);
    if (!response.ok) {
      throw new Error('Failed to fetch districts');
    }
    const data = await response.json();
    return data.data;
  }
  
  