import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import getWebsiteData from "../../hooks/admin/getWebisteData";

const About = () => {
  const [aboutData, setAboutInfo] = useState("");
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getWebsiteData();
        setAboutInfo(data?.data?.about || "");
      } catch (err) {
        console.error("Error fetching about info:", err);
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
          dangerouslySetInnerHTML={{ __html: aboutData }}
        />
      </div>
    </div>
  );
};

export default About;
