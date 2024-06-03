// TODO: implement auth
let _id: number;
const useUserId = (): number =>
  !_id ? (_id = Math.round(Math.random() * 10)) : _id;
export default useUserId;
