import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 20, children, ...rest }: P & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const Check = (p: P) => (<Base {...p}><path d="M20 6 9 17l-5-5" /></Base>);
export const Menu = (p: P) => (<Base {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Base>);
export const Close = (p: P) => (<Base {...p}><path d="M6 6l12 12M18 6 6 18" /></Base>);
export const Download = (p: P) => (<Base {...p}><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></Base>);
export const Share = (p: P) => (<Base {...p}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></Base>);
export const Search = (p: P) => (<Base {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Base>);
export const Arrow = (p: P) => (<Base {...p}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></Base>);

export const Instagram = (p: P) => (<Base {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></Base>);
export const Broadcast = (p: P) => (<Base {...p}><path d="M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1z" /><path d="M16 9a4 4 0 0 1 0 6" /><path d="M19 6a8 8 0 0 1 0 12" /></Base>);
export const YouTube = (p: P) => (<Base {...p}><rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 5 3-5 3z" /></Base>);
export const Facebook = (p: P) => (<Base {...p}><path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2z" /></Base>);

export const TopicIcon = ({ topic, ...p }: P & { topic: string }) => {
  switch (topic) {
    case "Investing basics":
      return (<Base {...p}><path d="M3 3v18h18" /><path d="m7 15 4-4 3 3 5-6" /></Base>);
    case "Tax, made simple":
      return (<Base {...p}><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 7h8M8 11h8M8 15h5" /></Base>);
    case "EPF and retirement":
      return (<Base {...p}><path d="M12 2v20" /><path d="M5 8h14l-2 12H7z" /></Base>);
    case "Government schemes":
      return (<Base {...p}><path d="M3 10 12 4l9 6" /><path d="M5 10v9h14v-9" /><path d="M10 19v-5h4v5" /></Base>);
    case "Buying smart":
      return (<Base {...p}><path d="M5 17h14l-1.5-6h-11z" /><circle cx="7.5" cy="18.5" r="1.5" /><circle cx="16.5" cy="18.5" r="1.5" /><path d="M7 11l2-4h6l2 4" /></Base>);
    case "Loans and debt":
      return (<Base {...p}><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6 12h.01M18 12h.01" /></Base>);
    default:
      return (<Base {...p}><circle cx="12" cy="12" r="9" /><path d="M9 10h.01M15 10h.01" /><path d="M9 15c1.5 1.3 4.5 1.3 6 0" /></Base>);
  }
};

export const SocialIcon = ({ id, ...p }: P & { id: string }) => {
  if (id === "instagram") return <Instagram {...p} />;
  if (id === "broadcast") return <Broadcast {...p} />;
  if (id === "youtube") return <YouTube {...p} />;
  return <Facebook {...p} />;
};
