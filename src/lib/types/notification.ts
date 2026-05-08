export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export type Notification = {
	id: number;
	user_id: string;
	message: string;
	type: NotificationType;
	is_read: boolean;
	created_at: string;
};
