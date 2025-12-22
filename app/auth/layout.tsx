const AuthLayout = ({ 
    children
  }: { 
    children: React.ReactNode
  }) => {
    return ( 
      <div 
        className="h-full flex items-center justify-center"
        style={{
          background: "linear-gradient(to bottom right, rgba(13, 119, 2, 0.05), rgba(241, 61, 6, 0.05))",
        }}
      >
        {children}
      </div>
     );
  }
   
  export default AuthLayout;