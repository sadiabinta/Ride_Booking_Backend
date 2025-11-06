const basefare = 100;
const costPerKm = 30;
const costPerMinute = 5;
const averageSpeed = 40;
const minFare = 150;

export const calculateFare = (distance: number) => {
  const estimatedTime = (distance / averageSpeed) * 60;
  const fare = basefare + costPerKm * distance + estimatedTime * costPerMinute;

  return {
    distance: distance.toFixed(2),
    duration: estimatedTime.toFixed(0),
    fare: Math.max(fare, minFare).toFixed(2),
  };
};
