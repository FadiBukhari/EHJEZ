/**
 * Study House Logos Mapping
 * 
 * Maps study house names (client usernames) to their logo images.
 * Add new study houses here with their corresponding logo file.
 * 
 * Logo files should be placed in /public/studyhouse-logos/
 * Supported formats: .png, .jpg, .jpeg, .jfif, .webp, .svg
 */

// Map of study house names to their logo filenames (include the correct extension)
const studyhouseLogos = {
  // Presentation Study Houses
  "uruk": "/studyhouse-logos/URUK.jfif",
  "wisdow": "/studyhouse-logos/WISDOW.jfif",
  "المعجم": "/studyhouse-logos/المعجم.jfif",
  "almujam": "/studyhouse-logos/المعجم.jfif",
  "fikar": "/studyhouse-logos/FIKAR.jfif",
  "lumina": "/studyhouse-logos/LUMINA.jfif",
  // Legacy entries (for backwards compatibility)
  "tajer": "/studyhouse-logos/tajer.jfif",
  "studyhouse1": "/studyhouse-logos/studyhouse1.png",
  "studyhouse2": "/studyhouse-logos/studyhouse2.png",
  "studyhouse3": "/studyhouse-logos/studyhouse3.png",
  "coffee study": "/studyhouse-logos/coffee-study.png",
  "quiet corner": "/studyhouse-logos/quiet-corner.png",
  "brain boost": "/studyhouse-logos/brain-boost.png",
};

// Default logo when no matching study house is found
const DEFAULT_LOGO = "/small1.png";

/**
 * Get the logo URL for a study house by name
 * @param {string} studyhouseName - The name/username of the study house
 * @returns {string} - The logo URL path
 */
export const getStudyhouseLogo = (studyhouseName) => {
  if (!studyhouseName) return DEFAULT_LOGO;
  
  // Normalize the name for case-insensitive matching
  const normalizedName = studyhouseName.toLowerCase().trim();
  
  // Try exact match first
  if (studyhouseLogos[normalizedName]) {
    return studyhouseLogos[normalizedName];
  }
  
  // Try partial match (if study house name contains any key)
  for (const [key, logo] of Object.entries(studyhouseLogos)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return logo;
    }
  }
  
  return DEFAULT_LOGO;
};

/**
 * Get the logo URL for a room based on its client/study house
 * @param {object} room - The room object with client data
 * @returns {string} - The logo URL path
 */
export const getRoomLogo = (room) => {
  // Try to get the study house name from the room's client
  const studyhouseName = room?.client?.user?.username || room?.client?.username;
  return getStudyhouseLogo(studyhouseName);
};

/**
 * Add or update a study house logo mapping
 * (Useful for dynamic updates)
 * @param {string} name - Study house name
 * @param {string} logoPath - Path to the logo image
 */
export const addStudyhouseLogo = (name, logoPath) => {
  studyhouseLogos[name.toLowerCase().trim()] = logoPath;
};

export default {
  getStudyhouseLogo,
  getRoomLogo,
  addStudyhouseLogo,
};
