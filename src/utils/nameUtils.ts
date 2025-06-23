export const getInitials = (name: string): string => {
  const parts = name.trim().split(' ').filter(part => part.length > 0);
  
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  // Take first letter of first name and last letter of last name
  const firstInitial = parts[0].charAt(0).toUpperCase();
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
  
  return `${firstInitial}${lastInitial}`;
};

export const getLastName = (name: string): string => {
  const parts = name.trim().split(' ').filter(part => part.length > 0);
  
  if (parts.length === 0) return '';
  
  // Return the last part as the last name
  return parts[parts.length - 1];
};

export const getMealIcon = (meal?: string): string => {
  if (!meal) return '';
  switch (meal?.toLowerCase()) {
    case 'steak': return '🥩';
    case 'chicken': return '🍗';
    case 'veg': return '🥗';
    default: return '';
  }
};