const Login = ({ handleLogin }: { handleLogin: () => void }) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <button
        onClick={handleLogin}
        className="py-3 px-2 bg-gray-200 rounded font-bold  text-slate-900"
      >
        Sign in with google
      </button>
    </div>
  );
};

export default Login;
