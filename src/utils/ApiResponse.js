export default class ApiResponse {
constructor({ success = true, message = 'OK', data = null, meta = undefined }) {
this.success = success;
this.message = message;
this.data = data;
if (meta !== undefined) this.meta = meta;
}
}