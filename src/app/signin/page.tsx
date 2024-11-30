import SignInForm from '@/components/signin/SignInForm';

const SingInPage = () => {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">로그인</h2>
      <SignInForm />
    </div>
  );
};

export default SingInPage;
