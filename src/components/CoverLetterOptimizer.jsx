import React, { useState, useEffect } from "react";
import { Document, Page, Text, View, StyleSheet, PDFViewer } from "@react-pdf/renderer";

// ---------------- PDF Styles ----------------
const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.4,
  },
  section: { marginBottom: 10 },
  heading: { fontSize: 12, fontWeight: "bold", marginBottom: 4 },
  paragraph: { marginBottom: 6, textAlign: "justify" },
  listItem: { marginLeft: 14, marginBottom: 4 },
  signature: { marginTop: 16, fontSize: 11 },
});

// ---------------- Reusable Inputs ----------------
const InputField = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      className="border p-2 rounded w-full"
      name={name}
      value={value || ""}
      onChange={onChange}
    />
  </div>
);

const TextAreaField = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      className="border p-2 rounded w-full h-24"
      name={name}
      value={value || ""}
      onChange={onChange}
    />
  </div>
);

const BulletListEditor = ({ label, items = [], setItems }) => {
  const updateItem = (idx, newVal) => {
    const newItems = [...(items || [])];
    newItems[idx] = newVal;
    setItems(newItems);
  };

  const addItem = () => setItems([...(items || []), ""]);
  const removeItem = (idx) => {
    const newItems = (items || []).filter((_, i) => i !== idx);
    setItems(newItems);
  };

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-2">{label}</h4>
      {(items || []).map((item, idx) => (
        <div key={idx} className="flex space-x-2 mb-2">
          <input
            className="border p-2 rounded flex-1"
            value={item ?? ""}
            onChange={(e) => updateItem(idx, e.target.value)}
          />
          <button
            type="button"
            className="text-red-500 text-sm"
            onClick={() => removeItem(idx)}
          >
            ✖
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="text-blue-600 text-sm mt-1"
      >
        + Add bullet
      </button>
    </div>
  );
};

// ---------------- PDF Component ----------------
const CoverLetterPDF = ({ fields }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      {/* Greeting + Intro */}
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.paragraph} wrap>{fields.greeting || ""}</Text>
        <Text style={pdfStyles.paragraph} wrap>{fields.intro || ""}</Text>
      </View>

      {/* Why Consider Me */}
      {fields.whyMe?.length > 0 && (
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.heading}>Why consider me:</Text>
          {fields.whyMe.map((point, i) => (
            <Text key={i} style={pdfStyles.listItem} wrap>{point || ""}</Text>
          ))}
        </View>
      )}

      {/* What Sets Me Apart */}
      {fields.whatSetsMeApart?.length > 0 && (
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.heading}>What sets me apart:</Text>
          {fields.whatSetsMeApart.map((point, i) => (
            <Text key={i} style={pdfStyles.listItem} wrap>{`${i + 1}. ${point || ""}`}</Text>
          ))}
        </View>
      )}

      {/* Recent Experience */}
      {fields.recentExperience && (
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.heading}>My most recent experience:</Text>
          <Text style={pdfStyles.paragraph} wrap>{fields.recentExperience || ""}</Text>
        </View>
      )}

      {/* What I Look Forward To */}
      {fields.whatILookForwardTo?.length > 0 && (
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.heading}>What I look forward to:</Text>
          {fields.whatILookForwardTo.map((point, i) => (
            <Text key={i} style={pdfStyles.listItem} wrap>• {point || ""}</Text>
          ))}
        </View>
      )}

      {/* Why Selected */}
      {fields.whySelected && (
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.heading}>Why I should be selected:</Text>
          <Text style={pdfStyles.paragraph} wrap>{fields.whySelected || ""}</Text>
        </View>
      )}

      {/* Closing */}
      {fields.closing && (
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.paragraph} wrap>{fields.closing || ""}</Text>
        </View>
      )}

      {/* Signature */}
      <Text style={pdfStyles.signature}>
        {(fields.signoff || "") + "\n"}
        {(fields.name || "") + "\n"}
        {[fields.email, fields.phone, fields.location].filter(Boolean).join(" | ")}
      </Text>
    </Page>
  </Document>
);

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ---------------- Main Component ----------------
async function fetchAllUser() {
  try {
    const reqToServer = await fetch(`${BASE_URL}/api/allusers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await reqToServer.json();
    return data.users || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

const CoverLetterOptimizer = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [pdfRenderKey, setPdfRenderKey] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [improvements, setImprovements] = useState([]);

  const [fields, setFields] = useState({
    name: "Venkata Mani Teja Sunkara",
    email: "samhitasari11@gmail.com",
    phone: "+1-571-545-1092",
    location: "Herndon, VA, USA",
    company: "Wipro",
    role: "Cloud Engineer",
    greeting: "Dear Hiring Manager,",
    intro: "I bring a strong blend of cloud engineering, IT support, and data analytics expertise...",
    whyMe: ["Migrated 25+ enterprise applications...", "Built 8+ Splunk dashboards..."],
    whatSetsMeApart: ["Strategic + Execution Focus...", "Cloud + Analytics Expertise..."],
    recentExperience: "At the University of Illinois, I developed ETL pipelines...",
    whatILookForwardTo: ["Working with mission-driven teams...", "Designing and scaling systems..."],
    whySelected: "I bring the technical expertise of a Cloud Engineer...",
    closing: "Thank you for considering my application—I'd love the opportunity...",
    signoff: "Warm regards,",
  });

  const [jobDesc, setJobDesc] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);

  // Fetch all users on mount
  useEffect(() => {
    (async () => {
      setUsersLoading(true);
      try {
        const users = await fetchAllUser();
        setAllUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setUsersLoading(false);
      }
    })();
  }, []);

  // Search filtering
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }
    const results = allUsers.filter(
      (u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResults(results);
  }, [search, allUsers]);

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value || "" });
    setPdfLoading(true);
    setTimeout(() => {
      setPdfRenderKey(prev => prev + 1);
      setPdfLoading(false);
    }, 100);
  };

  const handleBulletChange = (key, newItems) => {
    setFields({ ...fields, [key]: newItems });
    setPdfLoading(true);
    setTimeout(() => {
      setPdfRenderKey(prev => prev + 1);
      setPdfLoading(false);
    }, 100);
  };

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/optimize-cover-letter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields, jobDesc }),
      });

      const data = await response.json();

      if (data.optimizedFields) {
        let parsedFields;
        if (typeof data.optimizedFields === "string") {
          let cleanedString = data.optimizedFields.trim();
          if (cleanedString.startsWith("```json")) {
            cleanedString = cleanedString.replace(/^```json\s*/, "").replace(/\s*```$/, "");
          } else if (cleanedString.startsWith("```")) {
            cleanedString = cleanedString.replace(/^```\s*/, "").replace(/\s*```$/, "");
          }
          parsedFields = JSON.parse(cleanedString);
        } else {
          parsedFields = data.optimizedFields;
        }

        const mergedFields = { ...fields, ...parsedFields };
        setFields(mergedFields);

        // Save improvements if backend sends them
        if (data.improvements) {
          setImprovements(data.improvements);
        }
        console.log(data.improvements);
        setPdfLoading(true);
        setTimeout(() => {
          setPdfRenderKey(prev => prev + 1);
          setPdfLoading(false);
        }, 100);
      }
    } catch (err) {
      console.error("❌ Error in handleOptimize:", err);
      alert(`Failed to optimize cover letter: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Side (Search + Form) */}
      <div className="w-1/3 bg-white p-6 border-r shadow-md overflow-y-auto">
        {!selectedUser ? (
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">🔍 Search User</h2>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="border p-2 rounded w-full"
            />
            {usersLoading && (
              <div className="mt-4 text-center text-gray-600">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2">Loading users...</span>
              </div>
            )}
            {searchResults.length > 0 && (
              <ul className="border mt-2 rounded bg-white shadow">
                {searchResults.map((user, idx) => (
                  <li
                    key={idx}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedUser(user);
                      setFields((prev) => ({
                        ...prev,
                        name: user.name || prev.name,
                        email: user.email || prev.email,
                      }));
                      setPdfLoading(true);
                      setTimeout(() => {
                        setPdfRenderKey(prev => prev + 1);
                        setPdfLoading(false);
                      }, 100);
                    }}
                  >
                    {user.name} ({user.email})
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div>
            {selectedUser && (
              <button
                onClick={() => setSelectedUser(null)}
                className="mb-4 bg-gray-200 text-gray-800 py-1 px-3 rounded hover:bg-gray-300"
              >
                ← Go Back
              </button>
            )}

            <h2 className="text-xl font-bold mb-6 text-gray-800">✏️ Edit Cover Letter</h2>

            <div className="space-y-4">
              <InputField label="Name" name="name" value={fields.name} onChange={handleChange} />
              <InputField label="Email" name="email" value={fields.email} onChange={handleChange} />
              <InputField label="Phone" name="phone" value={fields.phone} onChange={handleChange} />
              <InputField label="Location" name="location" value={fields.location} onChange={handleChange} />
              <InputField label="Company" name="company" value={fields.company} onChange={handleChange} />
              <InputField label="Role" name="role" value={fields.role} onChange={handleChange} />

              <TextAreaField label="Greeting" name="greeting" value={fields.greeting} onChange={handleChange} />
              <TextAreaField label="Introduction" name="intro" value={fields.intro} onChange={handleChange} />

              <BulletListEditor
                label="Why Consider Me"
                items={fields.whyMe}
                setItems={(items) => handleBulletChange("whyMe", items)}
              />

              <BulletListEditor
                label="What Sets Me Apart"
                items={fields.whatSetsMeApart}
                setItems={(items) => handleBulletChange("whatSetsMeApart", items)}
              />

              <TextAreaField
                label="Most Recent Experience"
                name="recentExperience"
                value={fields.recentExperience}
                onChange={handleChange}
              />

              <BulletListEditor
                label="What I Look Forward To"
                items={fields.whatILookForwardTo}
                setItems={(items) => handleBulletChange("whatILookForwardTo", items)}
              />

              <TextAreaField
                label="Why I Should Be Selected"
                name="whySelected"
                value={fields.whySelected}
                onChange={handleChange}
              />

              <TextAreaField
                label="Closing Statement"
                name="closing"
                value={fields.closing}
                onChange={handleChange}
              />

              <InputField label="Sign Off" name="signoff" value={fields.signoff} onChange={handleChange} />

              <h3 className="text-lg font-semibold mt-4 text-gray-700">📄 Job Description</h3>
              <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste Job Description here..."
                className="border p-2 rounded w-full h-32"
              />

              <button
                onClick={handleOptimize}
                disabled={loading}
                className={`w-full py-2 rounded-lg ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-orange-500 hover:bg-orange-600'
                } text-white`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Optimizing...
                  </div>
                ) : (
                  '🚀 Optimize Cover Letter'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
      {/* <-- This closes the left panel */}

      {/* Right PDF Preview + Improvements */}
      <div className="flex-1 p-6 flex flex-col overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">📑 Cover Letter Preview</h2>
        <div className="flex-1 border rounded-lg shadow-lg bg-white flex flex-col mb-4">
          {pdfLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Updating PDF preview...</p>
              </div>
            </div>
          ) : pdfUrl ? (
            <>
              <object data={pdfUrl} type="application/pdf" className="w-full h-full">
                <p>PDF preview is not available in your browser.</p>
              </object>
              <a
                href={pdfUrl}
                download="Optimized-Cover-Letter.pdf"
                className="bg-green-600 text-white py-2 px-4 text-center hover:bg-green-700"
              >
                ⬇️ Download PDF
              </a>
            </>
          ) : (
            <PDFViewer key={pdfRenderKey} width="100%" height="100%">
              <CoverLetterPDF fields={fields} />
            </PDFViewer>
          )}
        </div>

        {/* Improvements Section */}
        {/* {improvements.length > 0 && (
  <div className="bg-white shadow rounded-lg p-4 border">
    <h3 className="text-lg font-semibold mb-3">✨ Improvements Made</h3>
    <ul className="space-y-3">
      {improvements.map((imp, idx) => (
        <li key={idx} className="p-3 border rounded bg-gray-50">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-red-600">Previous:</span>{" "}
            {Array.isArray(imp.previous)
              ? (
                  <ul className="list-disc ml-5">
                    {imp.previous.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )
              : imp.previous}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-semibold text-green-600">Optimized:</span>{" "}
            {Array.isArray(imp.optimized)
              ? (
                  <ul className="list-disc ml-5">
                    {imp.optimized.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )
              : imp.optimized}
          </p>
          <p className="text-sm text-gray-700 mt-1 italic">
            <span className="font-semibold">Why Better:</span> {imp.reason}
          </p>
        </li>
      ))}
    </ul>
  </div>
)} */}
{improvements.length > 0 && (
  <div className="bg-white shadow rounded-lg p-4 border">
    <h3 className="text-lg font-semibold mb-3">✨ Improvements Made</h3>
    <ul className="list-disc ml-5 space-y-2">
      {improvements.map((imp, idx) => (
        <li key={idx} className="text-sm text-gray-700">{imp}</li>
      ))}
    </ul>
  </div>
)}
      </div>
    </div>
  );
};

export default CoverLetterOptimizer;