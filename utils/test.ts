import axios from 'axios';

export const recordPropertyView = async (propertyId: string) => {
  try {
    await axios.post('/api/history', { propertyId });
  } catch (err) {
    console.error('Failed to record property view:', err);
  }
};
