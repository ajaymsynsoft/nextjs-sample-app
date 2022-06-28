export { Layout };

function Layout({ children }) {
  return (
    <section className="min-h-screen flex flex-col">
      <div className="flex flex-1 items-center justify-center">
        <div className="rounded-lg sm:border-2 px-4 lg:px-24 py-16 lg:max-w-xl sm:max-w-md w-full ">
          {children}
        </div>
      </div>
    </section>
  );
}
