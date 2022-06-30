export namespace TextUtils {
	
	export const escapeMarkdown = (text: string): string => text.replace(/([_*~`|])/g, '\\$1');
	
	export const estractText = (text: string): string => text.replace(/[^a-zA-Z\dÀ-ž\s]/g, '');
	
	export const extractEmojis = (text: string): Array<string> | null => /[\u1000-\uFFFF]+/.exec(text);
	
}
