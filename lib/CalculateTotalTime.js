export function getTotalHourMinute(modules) {
  let totalMinutes = 0;
  modules.forEach(module => {
    module.lessonIds?.forEach(lesson => {
      if (lesson.duration) {
        const [min, sec] = lesson.duration.split(":").map(Number);
        totalMinutes += min + (sec / 60);
      }
    });
  });
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  return { hours, minutes };
}