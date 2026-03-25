/**
 * Timezone Collector
 * Mengumpulkan data timezone dari sistem
 */
export class TimezoneCollector {
    constructor() {
        this.name = "timezone";
        this.enabled = true;
    }
    collect() {
        const date = new Date();
        const timezoneName = this.getTimezoneName(date);
        const offset = -date.getTimezoneOffset();
        const offsetHours = Math.floor(Math.abs(offset) / 60);
        const offsetMinutes = Math.abs(offset) % 60;
        const offsetSign = offset >= 0 ? "+" : "-";
        const offsetString = `UTC${offsetSign}${String(offsetHours).padStart(2, "0")}:${String(offsetMinutes).padStart(2, "0")}`;
        return {
            name: timezoneName,
            offset: offset,
            offsetString: offsetString,
            abbreviation: this.getTimezoneAbbreviation(date),
            dst: this.isDST(date),
        };
    }
    getTimezoneName(_date) {
        try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone;
        }
        catch {
            return "Unknown";
        }
    }
    getTimezoneAbbreviation(date) {
        try {
            const formatter = new Intl.DateTimeFormat("en", {
                timeZoneName: "short",
            });
            const parts = formatter.formatToParts(date);
            const timezonePart = parts.find((part) => part.type === "timeZoneName");
            return timezonePart?.value;
        }
        catch {
            return undefined;
        }
    }
    isDST(date) {
        const year = date.getFullYear();
        const january = new Date(year, 0, 1);
        const july = new Date(year, 6, 1);
        const janOffset = january.getTimezoneOffset();
        const julOffset = july.getTimezoneOffset();
        const currentOffset = date.getTimezoneOffset();
        // DST berlaku jika offset saat ini berbeda dengan offset di musim dingin
        const isNorthernHemisphere = janOffset > julOffset;
        const isDST = isNorthernHemisphere
            ? currentOffset < janOffset
            : currentOffset > janOffset;
        return isDST;
    }
}
//# sourceMappingURL=TimezoneCollector.js.map