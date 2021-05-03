export default ({ app }, inject) => {
  inject('todoDay', function (date) {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
    return days[date.getDay()]
  })

  inject('todoDayOrder', function (date) {
    if (date > 3 && date < 21) return 'th'
    switch (date % 10) {
      case 1:
        return 'st'
      case 2:
        return 'nd'
      case 3:
        return 'rd'
      default:
        return 'th'
    }
  })

  inject('todoMonth', function (date) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'September',
      'November',
      'December',
    ]
    return months[date.getMonth()]
  })
}
