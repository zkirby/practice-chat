import "./loading.css";

export default function Loading({
  children,
  loading,
}: React.PropsWithChildren<{ loading: boolean }>) {
  return loading ? <div className="spinner" /> : children;
}
