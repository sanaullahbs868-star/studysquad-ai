export interface Location {
  id: string;
  name: string;
  description: string;
  position: { x: number; y: number; z: number };
  hasBasketball: boolean;
  gameSign?: string;
  amenities: string[];
}

export class UniversityCampus {
  private locations: Map<string, Location> = new Map();

  constructor() {
    this.buildCampus();
  }

  private buildCampus(): void {
    const campusLocations: Location[] = [
      { id: "plaza", name: "Main Plaza", description: "Central gathering place for all students", position: { x: 0, y: 0, z: 0 }, hasBasketball: false, gameSign: "🏫 Welcome to StudySquad University!", amenities: ["Fountain", "Seating areas", "Information desk"] },
      { id: "library", name: "Grand Library", description: "Quiet study space for academic excellence", position: { x: -50, y: 0, z: 0 }, hasBasketball: false, gameSign: "📚 Knowledge is Power - Silent Zone", amenities: ["Study desks", "Computer labs", "Quiet zones"] },
      { id: "gym", name: "Fitness Center & Sports Complex", description: "Exercise and sports activities hub", position: { x: 50, y: 0, z: 0 }, hasBasketball: true, gameSign: "🏀 GAME COURT - Basketball Tournament Every Friday 3PM!", amenities: ["Basketball court", "Weights", "Treadmills", "Locker rooms"] },
      { id: "cafe", name: "Student Cafe", description: "Meet friends and relax with refreshments", position: { x: 0, y: 0, z: 50 }, hasBasketball: false, gameSign: "☕ Free WiFi & Cozy Vibes - Daily Specials!", amenities: ["Coffee bar", "Seating", "WiFi"] },
      { id: "dormitory", name: "Dormitory Complex", description: "Student housing and residential area", position: { x: 0, y: 0, z: -50 }, hasBasketball: false, gameSign: "🏠 Home Sweet Home - Rooms Available", amenities: ["Rooms", "Common areas", "Laundry facilities"] },
      { id: "laboratory", name: "Advanced Research Laboratory", description: "State-of-the-art research and experiments", position: { x: -100, y: 0, z: 50 }, hasBasketball: false, gameSign: "🔬 Future Innovation Hub - Research in Progress", amenities: ["Lab equipment", "Workstations", "Safety gear"] },
      { id: "auditorium", name: "Main Auditorium", description: "Lectures, events, and presentations", position: { x: 100, y: 0, z: 0 }, hasBasketball: false, gameSign: "🎤 Auditorium - Check Schedule for Events", amenities: ["Large stage", "Seating", "Sound system", "Projection screens"] },
      { id: "artgallery", name: "Art Gallery & Studios", description: "Creative expression and artistic pursuits", position: { x: -75, y: 0, z: -75 }, hasBasketball: false, gameSign: "🎨 Student Art Gallery - Submit Your Work!", amenities: ["Canvas", "Easels", "Paint supplies", "Display walls"] },
    ];
    campusLocations.forEach((loc) => this.locations.set(loc.id, loc));
  }

  getLocations(): Location[] {
    return Array.from(this.locations.values());
  }

  getAllLocationsDescription(): string {
    let desc = "🏫 **StudySquad University Campus Map**\n\n";
    this.locations.forEach((loc) => {
      desc += `📍 **${loc.name}**\n`;
      desc += `   ${loc.description}\n`;
      desc += `   📌 Position: (${loc.position.x}, ${loc.position.y}, ${loc.position.z})\n`;
      if (loc.gameSign) desc += `   🎮 ${loc.gameSign}\n`;
      desc += `   🏢 Amenities: ${loc.amenities.join(", ")}\n\n`;
    });
    return desc;
  }

  getLocationsByType(type: "social" | "academic" | "sports"): Location[] {
    const locations = this.locations;
    switch (type) {
      case "social":
        return [locations.get("plaza"), locations.get("cafe"), locations.get("dormitory")].filter((l): l is Location => l !== undefined);
      case "academic":
        return [locations.get("library"), locations.get("laboratory"), locations.get("auditorium")].filter((l): l is Location => l !== undefined);
      case "sports":
        return [locations.get("gym")].filter((l): l is Location => l !== undefined);
      default:
        return [];
    }
  }
}