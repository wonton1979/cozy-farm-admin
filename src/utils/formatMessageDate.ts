export default function formatMessageDate(createdAt: string): string {

    const date = new Date(createdAt);

    const dateGB = date.toLocaleDateString("en-GB", {
        timeZone: "Europe/London",
        day: "numeric",
        month: "numeric",
        year: "numeric"
    });

    const LOCAL_DATE = Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/London",
        day: "numeric",
        month: "numeric",
        year: "numeric"
    }).format(new Date());

    if (dateGB === LOCAL_DATE) { return "Today"; }

    const year = parseInt(LOCAL_DATE.split("/")[2]);
    const month = parseInt(LOCAL_DATE.split("/")[1]);
    const day = parseInt(LOCAL_DATE.split("/")[0]);

    const dateNow = new Date(year,month-1,day,0,0,0);
    const ONE_DAY = 24 * 60 * 60 * 1000

    if (dateNow.valueOf() - date.valueOf() > 0 && dateNow.valueOf() - date.valueOf() < ONE_DAY) {
        return "Yesterday";
    }

    return date.toLocaleDateString("en-GB", {
        timeZone: "Europe/London",
        day: "numeric",
        month: "short",
    });
}