export const calculateRemainingDays = (endDate: Date): number => {
    let date1 = new Date();
    let date2 = new Date(endDate);

    // Calculating the time difference
    // of two dates
    let Difference_In_Time = date2.getTime() - date1.getTime();

    // Calculating the no. of days between
    // two dates
    let Difference_In_Days = Math.round(
      Difference_In_Time / (1000 * 3600 * 24)
    );
    
    return Difference_In_Days;
  };