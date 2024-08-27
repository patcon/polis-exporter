// Manually build custom Polis export date format.
// Example: Wed Jul 27 21:56:00 WIB 2022
export function formatCustomDate(timestamp) {
    const date = new Date(Number(timestamp))

    // Convert to the target timezone and format (Asia/Jakarta)
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
      timeZoneName: "short",
      timeZone: "Asia/Jakarta",
    }
    const formatter = new Intl.DateTimeFormat('en-CA', options)
    const parts = formatter.formatToParts(date)

    const dayName = parts.find(part => part.type === 'weekday').value
    const monthName = parts.find(part => part.type === 'month').value
    const day = parts.find(part => part.type === 'day').value.padStart(2, '0')
    const year = parts.find(part => part.type === 'year').value

    const hours = parts.find(part => part.type === 'hour').value.padStart(2, '0')
    const minutes = parts.find(part => part.type === 'minute').value.padStart(2, '0')
    const seconds = parts.find(part => part.type === 'second').value.padStart(2, '0')

    const timeZone = parts.find(part => part.type === 'timeZoneName').value

    return `${dayName} ${monthName} ${day} ${hours}:${minutes}:${seconds} ${timeZone} ${year}`
  }