export async function fetchUpazillas(district: string) {
    // Note: The API doesn't provide a direct endpoint for upazillas.
    // We're assuming the districts data includes upazillas.
    const response = await fetch(`https://bdapis.com/api/v1.2/division`);
    if (!response.ok) {
      throw new Error('Failed to fetch upazillas');
    }
    const data = await response.json();
    const districtData = data.data.find(
      (div: any) => div.districts.some((dist: any) => dist.district === district)
    );
    if (!districtData) {
      throw new Error('District not found');
    }
    const selectedDistrict = districtData.districts.find(
      (dist: any) => dist.district === district
    );
    return selectedDistrict ? selectedDistrict.upazillas : [];
  }
  
  