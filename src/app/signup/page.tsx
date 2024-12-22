import SignUpForm from '@/app/signup/components/SignUpForm';

const SingUpPage = () => {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">회원가입</h2>
      <SignUpForm />
    </div>
  );
};

export default SingUpPage;
