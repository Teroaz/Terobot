export namespace ColorUtils {
	
	export const enum values {
		BASE = "#3f95ad",
		WHITE = "#e6e6e6",
		ERROR = "#FF3431"
	}
	
	export const uint8ToHex = (uint: Uint8ClampedArrayConstructor): string => {
		// @ts-ignore
		const [r, g, b] = uint
		return rgbToHex(r, g, b)
	}
	
	export const rgbToHex = (r: number, g: number, b: number): string => '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
	
}
