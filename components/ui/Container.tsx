type ContainerProps = {
  children: React.ReactNode;
};

export default function Container({
  children,
}: ContainerProps) {
  return (
    <div className="site-container mx-auto w-full max-w-[1440px] px-6 lg:px-12">
      {children}
    </div>
  );
}
