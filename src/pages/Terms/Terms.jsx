import { useEffect, useState } from "react";
import getWebsiteData from "../../hooks/admin/getWebisteData";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const Terms = () => {
  const [privacyData, setPrivacyInfo] = useState("");
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getWebsiteData();
        setPrivacyInfo(data?.data?.termsAndCondition || "");
      } catch (err) {
        console.error("Error fetching privacy info:", err);
      }
    };
    fetch();
  }, []);
  return (
    <div className="about-wrapper">
      <Navbar />
      <div className="about-page">
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "3rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "4rem",
          }}
          dangerouslySetInnerHTML={{ __html: privacyData }}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
