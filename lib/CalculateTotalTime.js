export function getTotalHourMinute(modules) {
  let totalMinutes = 0;
  modules.forEach(module => {
    module.lessonIds?.forEach(lesson => {
      totalMinutes += lesson.duration/60 || 0;
    });
  });
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  return { hours, minutes };
}