const basefare = 100;
const costPerKm = 30;
const costPerMinute = 5;
const averageSpeed = 40;
const minFare = 150;

export const calculateFare = (distance: number) => {
  const estimatedTime = (distance / averageSpeed) * 60;
  const fare = basefare + costPerKm * distance + estimatedTime * costPerMinute;

  return {
    distanceKm: distance.toFixed(2),
    estimatedTimeMin: estimatedTime.toFixed(0),
    fare: Math.max(fare, minFare).toFixed(2),
  };
};
