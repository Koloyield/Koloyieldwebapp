    export default function Notification({ notification }) {
  if (!notification) return null;

  return (
    <div>
      {notification.msg}
    </div>
  );
}