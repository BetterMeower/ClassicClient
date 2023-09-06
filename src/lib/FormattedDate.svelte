<!--
	Formatted date display with hover text.
	Mostly taken straight from Appel Level Database.
-->

<script>
	/**
	 * @file good thing I had already made a date display for appel level database
	 * *yoink with some tweaks*
	 */

	function epochToRelative(timestamp) {
    	var msPerMinute = 60 * 1000;
    	var msPerHour = msPerMinute * 60;
    	var msPerDay = msPerHour * 24;
    	var msPerMonth = msPerDay * 30;
    	var msPerYear = msPerDay * 365;
    	var elapsed = new Date().getTime() - timestamp;

    	if (elapsed < msPerMinute) {
			if (1 < Math.round(elapsed/1000)) {
            	return window.i18n.sprintf(window.i18n.ngettext("1 second ago", "1 second ago", 0), Math.round(elapsed/1000));
        	} else if (Math.round(elapsed/1000) == 0 || `${Math.round(elapsed/1000)}`.startsWith("-")) {
				return window.i18n.gettext("just now");
			} else {
            	return window.i18n.gettext("1 second ago");
        	}  
    	} else if (elapsed < msPerHour) {
        	return window.i18n.sprintf(window.i18n.ngettext("1 minute ago", "1 minute ago", 0), Math.round(elapsed/msPerMinute));
    	} else if (elapsed < msPerDay) {
        	return window.i18n.sprintf(window.i18n.ngettext("1 hour ago", "1 hour ago", 0), Math.round(elapsed/msPerHour));  
    	} else if (elapsed < msPerMonth) {
            return window.i18n.sprintf(window.i18n.ngettext("1 day ago", "1 day ago", 0), Math.round(elapsed/msPerDay));
    	} else if (elapsed < msPerYear) {
            return window.i18n.sprintf(window.i18n.ngettext("1 day ago", "1 day ago", 0), Math.round(elapsed/msPerMonth));
    	} else {
            return window.i18n.sprintf(window.i18n.ngettext("1 year ago", "1 year ago", 0), Math.round(elapsed/msPerYear));
    	}
	}
	 
	// 32-bit UTC time (1 is 1 second instead of 1 millisecond)
	export let date = 0;

	let text, title;

	$: {
		const _date = new Date(date * 1000);
		text = epochToRelative(_date.getTime());
		const sign = Math.sign((_date.getTimezoneOffset()/60))
		if (sign == 1) {
			title = `Time is in your local timezone (UTC ${(_date.getTimezoneOffset()/60) * -1}).
12-hour time: ${_date.toLocaleString([], {hourCycle: "h11"})}
24-hour time: ${_date.toLocaleString([], {hourCycle: "h23"})}
ISO: ${_date.toISOString()}`;
		} else {
			title = `Time is in your local timezone (UTC +${(_date.getTimezoneOffset()/60) * -1}).
12-hour time: ${_date.toLocaleString([], {hourCycle: "h11"})}
24-hour time: ${_date.toLocaleString([], {hourCycle: "h23"})}
ISO: ${_date.toISOString()}`;
		}
		setInterval(function() {
			text = epochToRelative(_date.getTime());
		}, 1000);
	}
</script>

<span {title} class="date">
	{text}
</span>

<style>
	.date {
		font-family: Simvoni-Italic, sans-serif;
		text-decoration: 2px underline dotted;
	}
</style>
