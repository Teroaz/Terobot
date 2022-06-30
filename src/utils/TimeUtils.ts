export namespace TimeUtils {

	export const minToMs = (minutes: number): number => minutes * 60000;

	export const msToFormattedString = (ms: number) => {
		const seconds = Math.floor((ms / 1000) % 60);
		const minutes = Math.floor((ms / (1000 * 60)) % 60);
		const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

		let res = '';
		if (hours > 0) {
			if (minutes === 0 && seconds === 0) {
				return `${hours < 10 ? '0' : ''}${hours}h00m00s`;
			} else {
				res += `${hours < 10 ? '0' : ''}${hours}h`;
			}
		}

		if (minutes > 0) {
			if (seconds === 0) {
				return `${res}${minutes < 10 ? '0' : ''}${minutes}m00s`;
			} else {
				res += `${minutes < 10 ? '0' : ''}${minutes}m`;
			}
		}

		return `${res}${seconds < 10 ? '0' : ''}${seconds}s`;
	};
}
