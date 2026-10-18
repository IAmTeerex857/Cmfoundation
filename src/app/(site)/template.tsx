// Templates re-mount on every navigation, so each page fades up as it arrives.
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
