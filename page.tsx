import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | BuildWithAI.digital',
  description: 'Read the Privacy Policy for our platform.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Information Collection and Use</h2>
        <p>
          We collect several different types of information for various purposes to provide and improve our Service to you. While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data").
        </p>

        <h3>Types of Data Collected</h3>
        <p>
          Personal Data may include, but is not limited to: Email address, First name and last name, Cookies and Usage Data.
        </p>

        <h2>2. Use of Data</h2>
        <p>
          BuildWithAI.digital uses the collected data for various purposes: to provide and maintain our Service; to notify you about changes to our Service; to provide customer support; to gather analysis or valuable information so that we can improve our Service; and to detect, prevent and address technical issues.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us by email: support@buildwithai.digital.
        </p>
      </div>
    </div>
  );
}