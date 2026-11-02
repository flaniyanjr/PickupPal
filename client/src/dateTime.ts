// Turns '2026-11-07' into 'Sat, Nov 7'. Returns the original text if it can't be read.
export function formatDate(date: string): string {
    const parsed = new Date(`${date}T00:00:00`)
    if (Number.isNaN(parsed.getTime())) {
        return date
    }
    return parsed.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

// Turns '19:30' into '7:30 PM'. Returns the original text if it can't be read.
export function formatTime(time: string): string {
    const parsed = new Date(`1970-01-01T${time}:00`)
    if (Number.isNaN(parsed.getTime())) {
        return time
    }
    return parsed.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

// True if the game's start time has passed, judged by this computer's clock.
export function isPast(date: string, time: string): boolean {
    const start = new Date(`${date}T${time}:00`)
    if (Number.isNaN(start.getTime())) {
        return false
    }
    return start.getTime() < Date.now()
}