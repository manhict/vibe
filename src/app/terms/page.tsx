import HomeFooter from "@/components/common/HomeFooter";
import React from "react";

export async function generateMetadata() {
  return {
    title: `Vibe Terms of Service`,
    description: `Join Vibe, the music platform where your votes decide the playlist. Discover, vote, and enjoy trending tracks with a vibrant community. Tune in and let your voice be heard!`,

    icons: { icon: "/favicon.png" },
    openGraph: {
      title: "Vibe - Shape the Playlist with Your Votes",
      description:
        "Explore, vote, and enjoy a community-driven music experience where your votes decide the beats.",
      url: "https://getvibe.in",
      type: "website",
      images: [
        {
          url: "https://getvibe.in/logo.svg",
          width: 1200,
          height: 630,
          alt: "Vibe - Shape the Playlist with Your Votes",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@tanmay11117",
      title: "Vibe - Shape the Playlist with Your Votes",
      description:
        "Discover, vote, and influence the playlist in real-time on Vibe, the collaborative music platform.",
      images: [
        {
          url: "https://getvibe.in/logo.svg",
          width: 1200,
          height: 630,
          alt: "Vibe - Collaborative Music Platform",
        },
        {
          url: "https://getvibe.in/logo.svg",
          width: 800,
          height: 600,
          alt: "Vibe Music Collaboration",
        },
      ],
    },
  };
}

function page() {
  return (
    <div className=" flex items-center flex-col  w-full justify-center bg-[url('/background.webp')] bg-cover">
      <div className=" w-9/12 mx-auto py-8 px-4">
        <article className="space-y-8">
          <header className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-2">Vibe Terms of Service</h1>
            <p className="italic text-gray-100">28/10/2024</p>
          </header>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-gray-100">
              Welcome to Vibe, the music platform where your votes shape the
              playlist. By using our service, you agree to these Terms of
              Service, our Privacy Policy, and any additional guidelines we may
              provide. Please read these terms carefully.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Our Service</h2>
            <p className="text-gray-100">
              Vibe enables users to discover, vote on, and enjoy trending tracks
              while fostering a vibrant community. You can find more information
              about how to use our features and services in our Help Center.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Eligibility</h2>
            <p className="text-gray-100">
              To use Vibe, you must be at least 13 years old. If you are under
              18, you must have permission from a parent or guardian. If you are
              a parent or guardian, you are responsible for your child&apos;s
              activities on our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              4. User Responsibilities
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Content Submission
                </h3>
                <p className="text-gray-100 mb-3">
                  When you upload content, you are responsible for ensuring it
                  complies with our guidelines and applicable laws.
                  Specifically, you must:
                </p>
                <ul className="list-disc pl-6 text-gray-100 space-y-2">
                  <li>Respect the rights of others</li>
                  <li>
                    Avoid submitting copyrighted material without permission
                  </li>
                  <li>
                    Ensure your content is not harmful, misleading, or illegal
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Conduct</h3>
                <p className="text-gray-100 mb-3">
                  You agree to use Vibe in a manner that is respectful and
                  lawful. This includes refraining from:
                </p>
                <ul className="list-disc pl-6 text-gray-100 space-y-2">
                  <li>Engaging in abusive behavior</li>
                  <li>Misleading others or impersonating others</li>
                  <li>Distributing spam or unauthorized advertising</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              5. Rights and Licenses
            </h2>
            <p className="text-gray-100">
              By submitting content to Vibe, you grant us a worldwide,
              non-exclusive, royalty-free license to use, reproduce, and
              distribute your content as part of our service. This license
              continues for a commercially reasonable time after you remove your
              content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Privacy</h2>
            <p className="text-gray-100">
              Your privacy is important to us. Our Privacy Policy outlines how
              we collect, use, and protect your personal information. Please
              review it to understand our practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Modifications</h2>
            <p className="text-gray-100">
              We may update these Terms of Service from time to time. If we make
              material changes, we will notify you. Continued use of Vibe after
              changes constitutes your acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
            <p className="text-gray-100">
              We reserve the right to terminate or suspend your access to Vibe
              if you violate these terms or engage in harmful behavior.
            </p>
          </section>

          {/* <section>
              <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
              <p className="text-gray-100">
                If you have any questions about these Terms of Service, please
                contact us at [].
              </p>
            </section> */}
        </article>
      </div>
      <HomeFooter className=" relative bottom-0 w-full" />
    </div>
  );
}

export default page;
