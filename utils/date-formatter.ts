export const calculateRemainingDays = (endDate: Date): number => {
  let date1 = new Date();
  let date2 = new Date(endDate);

  let Difference_In_Time = date2.getTime() - date1.getTime();
  let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));

  return Difference_In_Days;
};

export const surveyHasEnded = ({
  endDate,
  isActive,
  hasEnded,
}: {
  endDate: Date;
  isActive: boolean;
  hasEnded: boolean;
}): boolean => {
  return (!isActive || hasEnded) || (new Date(endDate).getTime() <= new Date().getTime());
};
