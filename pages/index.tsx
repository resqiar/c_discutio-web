export default function DashboardPage() {
  return <div></div>;
}

export function getServerSideProps() {
  return {
    redirect: {
      destination: "/dashboard",
      permanent: false,
    },
  };
}
