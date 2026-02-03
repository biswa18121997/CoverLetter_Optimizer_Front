import {
	Document,
	Page,
	Text,
	View,
	StyleSheet,
	PDFViewer,
	PDFDownloadLink,
} from "@react-pdf/renderer";
import { GithubIcon } from "lucide-react";
import { useState } from "react";
/*
  ResumeEditorOnePage.jsx
  - Left: editor
  - Right: live PDF preview (single A4 page, blue theme)
  - Toggle switch per section: bullets <-> numbered
  - Add/remove lines for every list-based section and add extra lines to text sections
  - Projects displayed in two columns
*/
// ---------------- PDF styles (compact single-page) ----------------
export const classicStyles = StyleSheet.create({
	page: {
		fontFamily: "Helvetica",
		fontSize: 9,
		padding: 8,
		lineHeight: 1.15,
		color: "#111",
	},
	headerRow: {
		marginBottom: 4,
	},
	name: {
		fontSize: 10,
		fontWeight: "bold",
		color: "#0b63c6",
	},
	contact: {
		fontSize: 8.5,
		color: "#333",
		marginTop: 4,
	},
	divider: {
		height: 2,
		backgroundColor: "#0b63c6",
		marginVertical: 6,
	},
	sectionTitle: {
		fontSize: 9.5,
		fontWeight: "bold",
		textTransform: "uppercase",
		marginTop: 3,
		marginBottom: 3,
		color: "#0b63c6",
	},
	paragraph: {
		fontSize: 9,
		marginBottom: 2,
	},
	jobTitle: {
		fontSize: 10,
		fontWeight: "bold",
	},
	jobMeta: {
		fontSize: 8.5,
		color: "#555",
	},
	bullet: {
		fontSize: 8.8,
		marginLeft: 4,
		marginBottom: 1,
	},
	skillsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	skillItem: {
		fontSize: 8.8,
		marginRight: 4,
		marginBottom: 2,
	},
	jobBlock: {
		marginBottom: 4,
	},
	jobTitleRow: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	small: {
		fontSize: 8.5,
		color: "#333",
		marginTop: 4,
	},
	projectsContainer: {
		flexDirection: "column",
	},
	compactListItem: {
		fontSize: 8,
		marginBottom: 2,
	},
	footerSpacing: {
		marginTop: 4,
	},
});

export const modernStyles = StyleSheet.create({
	page: {
		fontFamily: "Helvetica",
		fontSize: 9,
		padding: 20,
		lineHeight: 1.25,
		color: "#111",
	},
	header: {
		alignItems: "center",
		marginBottom: 10,
	},
	name: {
		fontSize: 18,
		fontWeight: "bold",
		letterSpacing: 0.5,
		marginBottom: 5
	},
	contact: {
		fontSize: 8.5,
		color: "#666",
		marginTop: 4,
	},
	divider: {
		height: 2,
		backgroundColor: "#444",
		marginVertical: 6,
	},
	sectionTitle: {
		fontSize: 9,
		fontWeight: "bold",
		letterSpacing: 0.8,
		textTransform: "uppercase",
		marginTop: 10,
		marginBottom: 4,
		color: "#444",
	},
	paragraph: {
		fontSize: 9,
		marginBottom: 2,
	},
	jobTitle: {
		fontSize: 10,
		fontWeight: "bold",
	},
	bullet: {
		fontSize: 8.8,
		marginLeft: 10,
		marginBottom: 2,
	},
	skillItem: {
		fontSize: 8.8,
		marginRight: 10,
		marginBottom: 4,
	},
	jobMeta: {
		fontSize: 8.5,
		color: "#666",
	},
	jobBlock: {
		marginBottom: 4,
	},
	jobTitleRow: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	small: {
		fontSize: 8.5,
		color: "#666",
		marginTop: 4,
	},
	projectsContainer: {
		flexDirection: "column",
	},
	skillsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	compactListItem: {
		fontSize: 8.8,
		marginBottom: 2,
	},
	footerSpacing: {
		marginTop: 4,
	},
});

export const sidebarStyles = StyleSheet.create({
	page: {
		fontFamily: "Helvetica",
		fontSize: 9,
		padding: 0,
	},
	container: {
		flexDirection: "row",
	},
	sidebar: {
		width: "30%",
		backgroundColor: "#f4f6f8",
		padding: 14,
	},
	main: {
		width: "70%",
		padding: 16,
	},
	name: {
		fontSize: 14,
		fontWeight: "bold",
		marginBottom: 6,
	},
	sectionTitle: {
		fontSize: 9,
		fontWeight: "bold",
		textTransform: "uppercase",
		marginTop: 8,
		marginBottom: 4,
		color: "#0b63c6",
	},
	bullet: {
		fontSize: 8.5,
		marginLeft: 6,
		marginBottom: 2,
	},
	contact: {
		fontSize: 8,
		color: "#555",
		marginBottom: 2,
		marginTop: 0,
	},
	paragraph: {
		fontSize: 8.8,
		marginBottom: 1.5,
		lineHeight: 1.2,
	},
	jobTitle: {
		fontSize: 9,
		fontWeight: "bold",
	},
	jobMeta: {
		fontSize: 8,
		color: "#666",
	},
	jobBlock: {
		marginBottom: 3,
	},
	jobTitleRow: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	small: {
		fontSize: 7.5,
		color: "#666",
		marginTop: 1,
	},
	projectsContainer: {
		flexDirection: "column",
	},
	skillsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	skillItem: {
		fontSize: 8,
		marginRight: 5,
		marginBottom: 1,
	},
	compactListItem: {
		fontSize: 8.3,
		marginBottom: 1.2,
	},
	footerSpacing: {
		marginTop: 3,
	},
});

const compactStyles = StyleSheet.create({
	page: {
		fontFamily: "Helvetica",
		fontSize: 9,
		paddingTop: 10,
		paddingBottom: 10,
		paddingHorizontal: 18,
		lineHeight: 1.02,
		marginTop: 4,
		marginBottom: 4
	},
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-end",
		marginBottom: 6,
		marginTop: 4,
	},
	name: { fontSize: 14, fontWeight: "bold", color: "#0b63c6" },
	contact: { fontSize: 8.5, color: "#333", marginTop: 6 },
	divider: { height: 4, backgroundColor: "#0b63c6", marginVertical: 6 },
	sectionTitle: {
		fontSize: 9.5,
		fontWeight: "bold",
		marginBottom: 2,
		textTransform: "uppercase",
		color: "#222",
		marginTop: 2,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-end",
	},
	paragraph: { fontSize: 9, marginBottom: 1, marginTop: 0, color: "#111" },
	small: { fontSize: 8.5, color: "#333", marginTop: 2 },
	jobBlock: { marginBottom: 4, marginTop: 4 },
	jobTitleRow: { flexDirection: "row", justifyContent: "space-between" },
	jobTitle: { fontSize: 10, fontWeight: "bold", marginBottom: 2 },
	jobMeta: { fontSize: 8.5, color: "#444", marginTop: 2 },
	bullet: { marginLeft: 6, fontSize: 8.8, marginTop: 1, marginBottom: 1 },
	projectsContainer: { flexDirection: "column", gap: 6 },
	skillsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 2,
	},
	skillItem: {
		fontSize: 8.8,
		marginRight: 4,
	},
	compactListItem: { fontSize: 8, marginBottom: 2 },
	footerSpacing: { marginTop: 4 },
});

export const professionalStyles = StyleSheet.create({
	page: {
		fontFamily: "Times-Roman",
		fontSize: 10,
		padding: 15,
		lineHeight: 1.3,
		color: "#000",
	},
	headerRow: {
		marginBottom: 2,
		alignItems: "center",
	},
	name: {
		marginBottom: 6,
		fontSize: 15,
		fontWeight: "bold",
		color: "#000",
		letterSpacing: 1,
	},
	contact: {
		fontSize: 9,
		color: "#555",
		marginTop: 4,
		alignItems: "center"
	},
	divider: {
		height: 1,
		backgroundColor: "#000",
		marginVertical: 2,
	},
	sectionTitle: {
		fontSize: 11,
		fontWeight: "bold",
		textTransform: "uppercase",
		marginTop: 4,
		marginBottom: 4,
		color: "#000",
		letterSpacing: 0.5,
	},
	paragraph: {
		fontSize: 10,
		marginBottom: 2,
	},
	jobTitle: {
		fontSize: 11,
		fontWeight: "bold",
	},
	jobMeta: {
		fontSize: 9,
		color: "#666",
	},
	bullet: {
		fontSize: 9.5,
		marginLeft: 10,
		marginBottom: 2,
	},
	skillsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	skillItem: {
		fontSize: 9.5,
		marginRight: 10,
		marginBottom: 2,
	},
	jobBlock: {
		marginBottom: 5,
	},
	jobTitleRow: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	small: {
		fontSize: 9,
		color: "#666",
		marginTop: 2,
	},
	projectsContainer: {
		flexDirection: "column",
	},
	compactListItem: {
		fontSize: 9,
		marginBottom: 2,
	},
	footerSpacing: {
		marginTop: 5,
	},
});

export const creativeStyles = StyleSheet.create({
	page: {
		fontFamily: "Helvetica",
		fontSize: 9,
		padding: 15,
		lineHeight: 1.2,
		color: "#222",
		backgroundColor: "#fafafa",
	},
	headerRow: {
		marginBottom: 10,
		alignItems: "center",
	},
	name: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#e74c3c",
		letterSpacing: 2,
	},
	contact: {
		fontSize: 8,
		color: "#7f8c8d",
		marginTop: 3,
	},
	divider: {
		height: 3,
		backgroundColor: "#e74c3c",
		marginVertical: 8,
		borderRadius: 2,
	},
	sectionTitle: {
		fontSize: 10,
		fontWeight: "bold",
		textTransform: "uppercase",
		marginTop: 4,
		marginBottom: 3,
		color: "#e74c3c",
		letterSpacing: 1,
	},
	paragraph: {
		fontSize: 9,
		marginBottom: 2,
	},
	jobTitle: {
		fontSize: 11,
		fontWeight: "bold",
		color: "#2c3e50",
	},
	jobMeta: {
		fontSize: 8.5,
		color: "#7f8c8d",
	},
	bullet: {
		fontSize: 9,
		marginLeft: 12,
		marginBottom: 1.5,
	},
	skillsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	skillItem: {
		fontSize: 9,
		marginRight: 12,
		marginBottom: 3,
		backgroundColor: "#ecf0f1",
		paddingHorizontal: 4,
		paddingVertical: 1,
		borderRadius: 3,
	},
	jobBlock: {
		marginBottom: 4,
	},
	jobTitleRow: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	small: {
		fontSize: 8,
		color: "#7f8c8d",
		marginTop: 2,
	},
	projectsContainer: {
		flexDirection: "column",
	},
	compactListItem: {
		fontSize: 8.5,
		marginBottom: 1.5,
	},
	footerSpacing: {
		marginTop: 2,
	},
});
// ---------------- PDF Document ----------------
const ResumePDF = ({ data, listStyles, template }) => {
	const stylesMap = {
		classic: classicStyles,
		modern: modernStyles,
		sidebar: sidebarStyles,
		compact: compactStyles,
		professional: professionalStyles,
		creative: creativeStyles,
	};
	const styles = stylesMap[template] || compactStyles;

	// split projects into two columns
	const leftProj = [];
	const rightProj = [];
	(data.projects || []).forEach((p, i) => (i % 2 === 0 ? leftProj.push(p) : rightProj.push(p)));

	// helper to render list items according to style
	const renderListItem = (item, idx, styleKey, providedStyles) => {
		const resolvedKey = styleKey.startsWith("projects_")
			? "projects"
			: styleKey;
		const style = listStyles[resolvedKey] || "bullet";
		const itemStyle = providedStyles.compactListItem || providedStyles.bullet;
		if (style === "number") {
			return (
				<Text key={idx} style={itemStyle}>
					{`${idx + 1}. ${item}`}
				</Text>
			);
		}
		return (
			<Text key={idx} style={itemStyle}>
				• {item}
			</Text>
		);
	};

	if (template === "sidebar") {
		return (
			<Document>
				<Page size="A4" style={styles.page}>
					<View style={styles.container}>
						{/* Sidebar */}
						<View style={styles.sidebar}>
							<Text style={styles.name}>{data.name || "Biswajit Sharma"}</Text>
							<View style={{ marginBottom: 8 }}>
								{data.email && <Text style={styles.contact}>{data.email}</Text>}
								{data.phone && <Text style={styles.contact}>{data.phone}</Text>}
								{data.location && <Text style={styles.contact}>{data.location}</Text>}
								{data.portfolio && <Text style={styles.small}>{data.portfolio}</Text>}
							</View>
							{/* Skills in sidebar */}
							<Text style={styles.sectionTitle}>Skills</Text>
							<View style={styles.skillsContainer}>
								{(data.skills || []).map((s, i) => (
									<Text key={i} style={styles.skillItem}>• {s}</Text>
								))}
							</View>
							{/* Certifications in sidebar */}
							<Text style={styles.sectionTitle}>Trainings / Certifications</Text>
							{(data.certifications || []).map((c, i) =>
								renderListItem(c, i, "certifications", styles)
							)}
						</View>
						{/* Main content */}
						<View style={styles.main}>
							{/* Career Objective */}
							<Text style={styles.sectionTitle}>Career Objective</Text>
							{(data.objectiveLines || []).map((line, i) => (
								<Text key={i} style={styles.paragraph}>{line}</Text>
							))}
							{/* Education */}
							<Text style={styles.sectionTitle}>Education</Text>
							{(data.education || []).map((edu, i) => (
								<View key={i} style={{ marginBottom: 2 }}>
									<Text style={styles.jobTitle}>
										{edu.degree} - <Text style={styles.jobMeta}>{edu.marks}</Text>
									</Text>
									<Text style={styles.jobMeta}>
										{edu.institution} {edu.year ? ` | ${edu.year}` : ""}
									</Text>
								</View>
							))}
							{/* Work Experience */}
							<Text style={styles.sectionTitle}>Work Experience</Text>
							{(data.experience || []).map((job, idx) => (
								<View key={idx} style={styles.jobBlock}>
									<View style={styles.jobTitleRow}>
										<Text style={styles.jobTitle}>
											{job.role || ""}{job.company ? ` • ${job.company}` : ""}
										</Text>
										<Text style={styles.jobMeta}>
											{(job.duration || "") + (job.location ? ` | ${job.location}` : "")}
										</Text>
									</View>
									{/* job.details is an array of lines */}
									{(job.details || []).map((b, i) => {
										const style = listStyles.workExperience || "bullet";
										if (style === "number") return <Text key={i} style={styles.bullet}>{`${i + 1}. ${b}`}</Text>;
										return <Text key={i} style={styles.bullet}>• {b}</Text>;
									})}
								</View>
							))}
							{/* Projects */}
							{(data.projects || []).length > 0 && (
								<View style={{ marginBottom: 6 }}>
									<Text style={styles.sectionTitle}>Projects</Text>
									<View style={styles.projectsContainer}>
										{data.projects.map((p, i) => (
											<View key={i} style={{ marginBottom: 4 }}>
												<Text style={styles.jobTitle}>
													{p.title} {p.duration ? ` • ${p.duration}` : ""}
												</Text>
												{(p.summaryLines || []).map((s, si) =>
													renderListItem(s, si, `projects_${i}`, styles)
												)}
												{p?.link && <Text style={styles.small}>
													Link: {p?.link}
												</Text>}
											</View>
										))}
									</View>
								</View>
							)}
							{/* Extra Curricular */}
							<Text style={styles.sectionTitle}>Extra Curricular Activities</Text>
							{(data.extras || []).map((x, i) => renderListItem(x, i, "extras", styles))}
							<Text style={styles.sectionTitle}>Interests & Hobbies</Text>
							{(data.interests || []).map((x, i) => renderListItem(x, i, "extras", styles))}
							<View style={styles.footerSpacing} />
						</View>
					</View>
				</Page>
			</Document>
		);
	}

	// Single column templates (classic, modern, compact, professional, creative)
	return (
		<Document>
			<Page size={[850, 1000]} style={styles.page}>
				{/* Header */}
				{template === 'modern' ? (
					<View style={styles.header}>
						<Text style={styles.name}>{data.name || "Biswajit Sharma"}</Text>
						<Text style={styles.contact}>
							{(data.email || "") + (data.phone ? " | " + data.phone : "") + (data.location ? " | " + data.location : "")}
						</Text>
						<Text style={styles.contact}>{data.portfolio || ""}</Text>
					</View>
				) : (
					<View style={styles.headerRow}>
						<View>
							<Text style={styles.name}>{data.name || "Biswajit Sharma"}</Text>
							<Text style={styles.contact}>
								{(data.email || "") + (data.email && data.phone ? " | " : "") + (data.phone || "") + " "}
								{(data.location ? ` | ${data.location}` : "")}
							</Text>
						</View>
						<View>
							<Text style={styles.small || styles.contact}>{data.portfolio || ""}</Text>
						</View>
					</View>
				)}
				{styles.divider && <View style={styles.divider} />}
				{/* Career Objective */}
				<View style={{ marginBottom: 6 }}>
					<Text style={styles.sectionTitle}>Career Objective</Text>
					{(data.objectiveLines || []).map((line, i) => (
						<Text key={i} style={styles.paragraph}>{line}</Text>
					))}
				</View>
				{/* Education */}
				<View style={{ marginBottom: 6 }}>
					<Text style={styles.sectionTitle}>Education</Text>
					{(data.education || []).map((edu, i) => (
						<View key={i} style={{ marginBottom: 2 }}>
							<Text style={styles.jobTitle}>{edu.degree} - <Text style={styles.jobMeta}>{edu.marks}</Text></Text>
							<Text style={styles.jobMeta}>{edu.institution} {edu.year ? ` | ${edu.year}` : ""}</Text>
						</View>
					))}
				</View>
				{/* Work Experience */}
				<View style={{ marginBottom: 6 }}>
					<Text style={styles.sectionTitle}>Work Experience</Text>
					{(data.experience || []).map((job, idx) => (
						<View key={idx} style={styles.jobBlock}>
							<View style={styles.jobTitleRow}>
								<Text style={styles.jobTitle}>
									{job.role || ""}{job.company ? ` • ${job.company}` : ""}
								</Text>
								<Text style={styles.jobMeta}>
									{(job.duration || "") + (job.location ? ` | ${job.location}` : "")}
								</Text>
							</View>
							{/* job.details is an array of lines */}
							{(job.details || []).map((b, i) => {
								const style = listStyles.workExperience || "bullet";
								if (style === "number") return <Text key={i} style={styles.bullet}>{`${i + 1}. ${b}`}</Text>;
								return <Text key={i} style={styles.bullet}>• {b}</Text>;
							})}
						</View>
					))}
				</View>
				{/* Projects (full width) */}
				{(data.projects || []).length > 0 && (
					<View style={{ marginBottom: 6 }}>
						<Text style={styles.sectionTitle}>Projects</Text>
						<View style={styles.projectsContainer}>
							{data.projects.map((p, i) => (
								<View key={i} style={{ marginBottom: 4 }}>
									<Text style={styles.jobTitle}>
										{p.title} {p.duration ? ` • ${p.duration}` : ""}
									</Text>
									{(p.summaryLines || []).map((s, si) =>
										renderListItem(s, si, `projects_${i}`, styles)
									)}
									{p?.link && <Text style={styles.small}>
										Link: {p?.link}
									</Text>}
								</View>
							))}
						</View>
					</View>
				)}
				{/* certification */}
				<View style={{ marginBottom: 6 }}>
					<Text style={styles.sectionTitle}>Trainings / Certifications</Text>
					{(data.certifications || []).map((c, i) => renderListItem(c, i, "certifications", styles))}
				</View>
				{/* Skills */}
				{/* Skills (row-wise) */}
				<View style={{ marginBottom: 6 }}>
					<Text style={styles.sectionTitle}>Skills</Text>
					<View style={styles.skillsContainer}>
						{(data.skills || []).map((s, i) => (
							<Text key={i} style={styles.skillItem}>• {s}</Text>
						))}
					</View>
				</View>
				{/* Extra Curricular */}
				<View style={{ marginBottom: 4 }}>
					<Text style={styles.sectionTitle}>Extra Curricular Activities</Text>
					{(data.extras || []).map((x, i) => renderListItem(x, i, "extras", styles))}
				</View>
				<View style={{ marginBottom: 4 }}>
					<Text style={styles.sectionTitle}>Interests & Hobbies</Text>
					{(data.interests || []).map((x, i) => renderListItem(x, i, "extras", styles))}
				</View>
				<View style={styles.footerSpacing} />
			</Page>
		</Document>
	);
};
// ---------------- Editor UI components ----------------
const ToggleSwitch = ({ value, onChange }) => {
	// value: "bullet" | "number"
	return (
		<div className="flex items-center gap-2">
			<button
				type="button"
				onClick={() => onChange("bullet")}
				className={`px-2 py-1 rounded text-sm ${value === "bullet" ? "bg-gray-200" : "bg-white"}`}
			>
				• Bullets
			</button>
			<button
				type="button"
				onClick={() => onChange("number")}
				className={`px-2 py-1 rounded text-sm ${value === "number" ? "bg-gray-200" : "bg-white"}`}
			>
				1. Numbered
			</button>
		</div>
	);
};
const ArrayEditor = ({ title, items, setItems, toggleValue, setToggle, placeholder }) => {
	const add = () => setItems([...(items || []), ""]);
	const update = (i, v) => {
		const copy = [...(items || [])];
		copy[i] = v;
		setItems(copy);
	};
	const remove = (i) => setItems((items || []).filter((_, idx) => idx !== i));
	return (
		<div className="mb-3">
			<div className="flex justify-between items-center mb-2">
				<strong>{title}</strong>
				<div className="flex items-center gap-3">
					<ToggleSwitch value={toggleValue} onChange={setToggle} />
					<button onClick={add} className="text-sm text-blue-600">+ Add</button>
				</div>
			</div>
			{(items || []).map((it, i) => (
				<div key={i} className="flex gap-2 mb-2">
					<input
						className="border p-1 rounded flex-1"
						value={it}
						placeholder={placeholder}
						onChange={(e) => update(i, e.target.value)}
					/>
					<button onClick={() => remove(i)} className="text-red-500">✖</button>
				</div>
			))}
			{(items || []).length === 0 && <p className="text-xs text-gray-500">No items yet</p>}
		</div>
	);
};
// For Experience: each job has details array; each job's details uses the global workExperience listStyle
const ExperienceEditor = ({ experience, setExperience, workListStyle, setWorkListStyle }) => {
	const addJob = () =>
		setExperience([...experience, { role: "", company: "", duration: "", location: "", details: [""] }]);
	const updateJob = (idx, key, value) => {
		const copy = experience.map((j, i) => (i === idx ? { ...j, [key]: value } : j));
		setExperience(copy);
	};
	const removeJob = (idx) => setExperience(experience.filter((_, i) => i !== idx));
	const addDetail = (idx) => {
		const copy = experience.map((j, i) => (i === idx ? { ...j, details: [...(j.details || []), ""] } : j));
		setExperience(copy);
	};
	const updateDetail = (jobIdx, detIdx, val) => {
		const copy = experience.map((j, i) =>
			i === jobIdx ? { ...j, details: (j.details || []).map((d, di) => (di === detIdx ? val : d)) } : j
		);
		setExperience(copy);
	};
	const removeDetail = (jobIdx, detIdx) => {
		const copy = experience.map((j, i) =>
			i === jobIdx ? { ...j, details: (j.details || []).filter((_, di) => di !== detIdx) } : j
		);
		setExperience(copy);
	};
	return (
		<div className="mb-3">
			<div className="flex justify-between items-center mb-2">
				<strong>Work Experience</strong>
				<div className="flex items-center gap-3">
					<ToggleSwitch value={workListStyle} onChange={setWorkListStyle} />
					<button onClick={addJob} className="text-sm text-blue-600">+ Add Job</button>
				</div>
			</div>
			{(experience || []).map((job, jIdx) => (
				<div key={jIdx} className="border rounded p-2 mb-2">
					<div className="grid grid-cols-2 gap-2">
						<input value={job.role} onChange={(e) => updateJob(jIdx, "role", e.target.value)} placeholder="Role" className="border p-1 rounded" />
						<input value={job.company} onChange={(e) => updateJob(jIdx, "company", e.target.value)} placeholder="Company" className="border p-1 rounded" />
						<input value={job.duration} onChange={(e) => updateJob(jIdx, "duration", e.target.value)} placeholder="Duration" className="border p-1 rounded" />
						<input value={job.location} onChange={(e) => updateJob(jIdx, "location", e.target.value)} placeholder="Location" className="border p-1 rounded" />
					</div>
					<div className="mt-2">
						<div className="flex justify-between items-center mb-2">
							<span className="text-sm font-medium">Details</span>
							<button onClick={() => addDetail(jIdx)} className="text-sm text-blue-600">+ Add line</button>
						</div>
						{(job.details || []).map((d, di) => (
							<div key={di} className="flex gap-2 mb-2">
								<input className="border p-1 rounded flex-1" value={d} onChange={(e) => updateDetail(jIdx, di, e.target.value)} placeholder="Detail line" />
								<button onClick={() => removeDetail(jIdx, di)} className="text-red-500">✖</button>
							</div>
						))}
					</div>
					<div className="mt-2 text-right">
						<button onClick={() => removeJob(jIdx)} className="text-red-500 text-sm">Remove Job</button>
					</div>
				</div>
			))}
		</div>
	);
};
// ---------------- Main Component ----------------
export default function ResumeEditorOnePage() {
	const [template, setTemplate] = useState('modern');
	// Prefill exact content you gave, but convert multiline parts into arrays
	const [data, setData] = useState({
		name: "Biswajit Sharma",
		email: "biswajitshrm6@gmail.com",
		phone: "+91 6291665147",
		location: "Kolkata, India",
		portfolio: "https://github.com/biswa18121997",
		objectiveLines: [
			"Result-oriented, detail-focused Full Stack Developer skilled in MERN Stack, Java, etc. Eager to collaborate and contribute to open",
			"source, write reusable code and thrive in start-ups by building scalable solutions. Aspire to become an important part of the development Team of an Organization.",
		],
		experience: [
			{
				role: "Full Stack Developer",
				company: "FLASHFIRE, Virtual",
				duration: "5 months",//Jun 2025 - Present
				location: "",
				details: [
					"Designed and Developed the dashboard backend for users, created frontend routing and Backend for managing the crud operations",
					"Developed and Created the entire Landing page and its backend with discord integrations and automations with redis and messaging queues for calls automation and automated email and welcome email automation",
					"Built several utility tools and browser extensions for varied number of tools with automation servers",
					"Contributed to the development of AI resume builder and/or optimizer and AI cover letter builder and optimizer"
				],
			},
		],
		education: [
			{ degree: "Bachelor of Technology (B.Tech), Computer Science", institution: "West Bengal University Of Technology", year: "2017 - 2021", marks: "7.38 CGPA" },
			{ degree: "High School (XII), PCM", institution: "MHSHS", year: "", marks: "60% " }//2015-2017
		],
		interests: ['Web3', 'Low-level Programming', 'Gaming in free time'],
		certifications: [
			"Full Stack Development Course — Internshala Trainings, Virtual",//(Oct 2024 - Jun 2025)
			"C/C++ — APTECH, Kolkata",//(Sep 2017 - Jan 2018)
			"CCNA(Cisco Certified Networking Associate) — CISCO, Virtual",//(Sep 2019 - Mar 2020)
		],
		projects: [
			{
				title: "Developed YouTube-Inspired Platform ↗",
				duration: "",//May 2025 - Jun 2025
				summaryLines: [
					"Built a YouTube clone using the MERN stack, incorporating features like video watch history and video upload, user authentication, and a responsive UI, secure user registration and login using (JWT) for managing authentication and sessions.",
					"Developed a video management system that enables users to upload videos with titles, descriptions, and thumbnails, along with a seamless video player for playback.",
				],
				link: 'https://yt-front-end.vercel.app/'
			},
			{
				title: "ShoppyGlobe E-commerce Application ↗",
				duration: "",//Mar 2025 - Apr 2025
				summaryLines: [
					"Developed ShoppyGlobe, a fully operational e-commerce platform, allowing users to explore products, manage a shopping cart, and complete transactions.",
					"Built a responsive, user-friendly interface using React and React Router, ensuring smooth navigation across pages.",
					"Redux was used for efficient cart and state management, enabling seamless updates during the shopping process.",
					"JWT-based authentication was implemented to secure user accounts and transactions, along with OAUTH 2.0 integration, ensuring secure endpoints",
				],
				link: 'https://shoppy-globe-two-plum.vercel.app'
			},
			{
				title: " Weather Forecast Application ↗ ",
				duration: "",//Oct 2021 - Oct 2022
				summaryLines: [
					` Developed a weather forecast application with a user friendly interface, enabling to check real-time weather and forecasts at live locations. Designed with a focus on responsiveness, user experience and accessibility across devices. `,
					`Implemented asynchronous APIs to retrieve weather data and dynamically display current conditions and forecasts. Utilized JavaScript for efficient data handling and interaction, enhancing functionality and interactivity of the application.`,
				],
				link: 'https://biswa18121997.github.io/weatherApp.github.io/'
			},
			{
				title: "Flappy Bird Game",
				duration: "",//Oct 2021 - Oct 2022
				summaryLines: [
					`Developed a Flappy bird game in JAVA , used swing GUI , Timers and Event Listeners Libraries/ APIs to acheive a smooth and flawless outcome `,
					`Understood how the combination of timers and event can enhace User Experience multiple folds`,
				],
				link: 'https://github.com/biswa18121997/flappy-bird'
			},
			{
				title: " Fake news detection program(ML)",
				duration: "",//Oct 2021 - Oct 2022
				summaryLines: [
					` Developed a Fake News Detection app in python with Machine Learning . Learned NLP Algorithms like TFIDF, Passive agressive Classifiers and other models and libraries.`,
					`Achieved an accuracy of 96.1%. `,
				],
			},
		],
		//],
		skills: ["Java", "Node.js", "Redux", "Responsive Design", "Git", "Redis-Pubsubs & Caching", "MySQL", "REST API", "Express.js", "TypeScript/Javascript", "Attention to Detail", "MongoDB", "React", "Collaboration", "DBMS", "Basic System Design & Devops", "Basic Docker Containerization", "Jest", "Next.js", "PostgresSql+Prisma", "OAuth2.0+RBAC"],
		extras: [
			"Attended global entrepreneurship summit 2017, at IIT Kharagpur. Got an opportunity to engage in an entrepreneurial environment with innovative founders and tech CEOs.",
			"Participated in a Robotics Workshop organized by our College, led a 5-member team for projects that includes Obstruction avoiding toy car and Drone making from scratch. Used Arduino to achieve the goals of the project.",
		],
	});
	// listStyles controls per-section list rendering: "bullet" | "number"
	const [listStyles, setListStyles] = useState({
		certifications: "bullet",
		projects: "bullet",
		skills: "bullet",
		extras: "bullet",
		workExperience: "bullet", // used for details in each job
	});
	// helpers to update state
	const setField = (k) => (e) => setData((s) => ({ ...s, [k]: e.target.value }));
	const setObjectiveLine = (i, v) =>
		setData((s) => ({ ...s, objectiveLines: s.objectiveLines.map((l, idx) => (idx === i ? v : l)) }));
	const addObjectiveLine = () => setData((s) => ({ ...s, objectiveLines: [...s.objectiveLines, ""] }));
	const removeObjectiveLine = (i) => setData((s) => ({ ...s, objectiveLines: s.objectiveLines.filter((_, idx) => idx !== i) }));
	const setCertifications = (items) => setData((s) => ({ ...s, certifications: items }));
	const setSkills = (items) => setData((s) => ({ ...s, skills: items }));
	const setExtras = (items) => setData((s) => ({ ...s, extras: items }));
	const setProjects = (items) => setData((s) => ({ ...s, projects: items }));
	const setEducation = (items) => setData((s) => ({ ...s, education: items }));
	const setExperience = (items) => setData((s) => ({ ...s, experience: items }));
	// small list editors (generic)
	const GenericListEditor = ({ title, items, setItems, styleKey, placeholder = "" }) => {
		const add = () => setItems([...(items || []), ""]);
		const update = (i, v) => {
			const copy = [...(items || [])];
			copy[i] = v;
			setItems(copy);
		};
		const remove = (i) => setItems((items || []).filter((_, idx) => idx !== i));
		return (
			<div className="mb-3">
				<div className="flex justify-between items-center mb-2">
					<strong>{title}</strong>
					<div className="flex items-center gap-2">
						<ToggleSwitch value={listStyles[styleKey]} onChange={(val) => setListStyles((s) => ({ ...s, [styleKey]: val }))} />
						<button onClick={add} className="text-sm text-blue-600">+ Add</button>
					</div>
				</div>
				{(items || []).map((it, i) => (
					<div key={i} className="flex gap-2 mb-2">
						<input className="border p-1 rounded flex-1" value={it} placeholder={placeholder} onChange={(e) => update(i, e.target.value)} />
						<button onClick={() => remove(i)} className="text-red-500">✖</button>
					</div>
				))}
				{(items || []).length === 0 && <p className="text-xs text-gray-500">No items yet</p>}
			</div>
		);
	};
	// Project editor: each project has title, duration, and summary lines. We allow adding/removing summary lines.
	const ProjectEditor = () => {
		const addProject = () => setProjects([...(data.projects || []), { title: "", duration: "", summaryLines: [""] }]);
		const updateProjectField = (idx, key, val) => {
			const copy = data.projects.map((p, i) => (i === idx ? { ...p, [key]: val } : p));
			setProjects(copy);
		};
		const addSummaryLine = (idx) => {
			const copy = data.projects.map((p, i) => (i === idx ? { ...p, summaryLines: [...(p.summaryLines || []), ""] } : p));
			setProjects(copy);
		};
		const updateSummaryLine = (pIdx, lIdx, val) => {
			const copy = data.projects.map((p, i) =>
				i === pIdx ? { ...p, summaryLines: p.summaryLines.map((s, si) => (si === lIdx ? val : s)) } : p
			);
			setProjects(copy);
		};
		const removeSummaryLine = (pIdx, lIdx) => {
			const copy = data.projects.map((p, i) => (i === pIdx ? { ...p, summaryLines: p.summaryLines.filter((_, si) => si !== lIdx) } : p));
			setProjects(copy);
		};
		const removeProject = (i) => setProjects(data.projects.filter((_, idx) => idx !== i));
		return (
			<div className="mb-3">
				<div className="flex justify-between items-center mb-2">
					<strong>Projects</strong>
					<div className="flex items-center gap-2">
						<ToggleSwitch value={listStyles.projects} onChange={(val) => setListStyles((s) => ({ ...s, projects: val }))} />
						<button onClick={addProject} className="text-sm text-blue-600">+ Add Project</button>
					</div>
				</div>
				{(data.projects || []).map((p, i) => (
					<div key={i} className="border rounded p-2 mb-2">
						<div className="flex gap-2">
							<input className="border p-1 rounded flex-1" value={p.title} placeholder="Title" onChange={(e) => updateProjectField(i, "title", e.target.value)} />
							<input className="border p-1 rounded" value={p.duration} placeholder="Duration" onChange={(e) => updateProjectField(i, "duration", e.target.value)} />
							<button onClick={() => removeProject(i)} className="text-red-500">Remove</button>
						</div>
						<div className="mt-2">
							<div className="flex justify-between items-center mb-2">
								<span className="text-sm font-medium">Summary Lines</span>
								<button onClick={() => addSummaryLine(i)} className="text-sm text-blue-600">+ Add line</button>
							</div>
							{(p.summaryLines || []).map((s, si) => (
								<div key={si} className="flex gap-2 mb-2">
									<input className="border p-1 rounded flex-1" value={s} onChange={(e) => updateSummaryLine(i, si, e.target.value)} />
									<button onClick={() => removeSummaryLine(i, si)} className="text-red-500">✖</button>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		);
	};
	return (
		<div className="flex h-screen bg-gray-100 p-4 gap-4">
			{/* Editor */}
			<div className="w-1/2 bg-white p-4 rounded shadow-md overflow-y-auto">
				<h2 className="text-lg font-bold mb-3">Edit Resume (one-page)</h2>
				{/* Template Dropdown */}
				<div className="mb-3">
					<label className="block text-sm font-medium mb-1">Resume Template</label>
					<select
						value={template}
						onChange={(e) => setTemplate(e.target.value)}
						className="border p-2 rounded w-full"
					>
						<option value="classic">Classic (Blue accents)</option>
						<option value="modern">Modern (Clean, centered)</option>
						<option value="compact">Compact (Dense layout)</option>
						<option value="sidebar">Sidebar (Two-column)</option>
						<option value="professional">Professional (Formal serif)</option>
						<option value="creative">Creative (Bold colors)</option>
					</select>
				</div>
				<div className="grid grid-cols-2 gap-2 mb-3">
					<input className="border p-2 rounded" value={data.name} onChange={(e) => setData((s) => ({ ...s, name: e.target.value }))} placeholder="Name" />
					<input className="border p-2 rounded" value={data.portfolio} onChange={(e) => setData((s) => ({ ...s, portfolio: e.target.value }))} placeholder="Portfolio / Links" />
					<input className="border p-2 rounded" value={data.email} onChange={(e) => setData((s) => ({ ...s, email: e.target.value }))} placeholder="Email" />
					<input className="border p-2 rounded" value={data.phone} onChange={(e) => setData((s) => ({ ...s, phone: e.target.value }))} placeholder="Phone" />
					<input className="border p-2 rounded col-span-2" value={data.location} onChange={(e) => setData((s) => ({ ...s, location: e.target.value }))} placeholder="Location" />
				</div>
				{/* Objective lines editor */}
				<div className="mb-3">
					<div className="flex justify-between items-center mb-2">
						<strong>Career Objective</strong>
						<div className="flex items-center gap-2">
							<button onClick={addObjectiveLine} className="text-sm text-blue-600">+ Add line</button>
						</div>
					</div>
					{(data.objectiveLines || []).map((l, i) => (
						<div key={i} className="flex gap-2 mb-2">
							<input className="border p-1 rounded flex-1" value={l} onChange={(e) => setObjectiveLine(i, e.target.value)} />
							<button onClick={() => removeObjectiveLine(i)} className="text-red-500">✖</button>
						</div>
					))}
				</div>
				{/* Experience editor */}
				<ExperienceEditor experience={data.experience} setExperience={setExperience} workListStyle={listStyles.workExperience} setWorkListStyle={(val) => setListStyles((s) => ({ ...s, workExperience: val }))} />
				{/* Education editor */}
				<div className="mb-3">
					<div className="flex justify-between items-center mb-2">
						<strong>Education</strong>
						<button onClick={() => setEducation([...data.education, { degree: "", institution: "", year: "", marks: "" }])} className="text-sm text-blue-600">+ Add</button>
					</div>
					{(data.education || []).map((edu, i) => (
						<div key={i} className="flex gap-2 mb-2">
							<input className="border p-1 rounded flex-1" value={edu.degree} placeholder="Degree" onChange={(e) => setEducation(data.education.map((ed, idx) => idx === i ? { ...ed, degree: e.target.value } : ed))} />
							<input className="border p-1 rounded" value={edu.institution} placeholder="Institution" onChange={(e) => setEducation(data.education.map((ed, idx) => idx === i ? { ...ed, institution: e.target.value } : ed))} />
							<input className="border p-1 rounded" value={edu.year} placeholder="Year(s)" onChange={(e) => setEducation(data.education.map((ed, idx) => idx === i ? { ...ed, year: e.target.value } : ed))} />
							<input className="border p-1 rounded" value={edu.marks} placeholder="Marks/CGPA" onChange={(e) => setEducation(data.education.map((ed, idx) => idx === i ? { ...ed, marks: e.target.value } : ed))} />
						</div>
					))}
				</div>
				{/* Certifications */}
				<GenericListEditor title="Trainings / Certifications" items={data.certifications} setItems={setCertifications} styleKey="certifications" placeholder="Certification" />
				{/* Projects */}
				<ProjectEditor />
				{/* Skills */}
				<GenericListEditor title="Skills" items={data.skills} setItems={setSkills} styleKey="skills" placeholder="Skill" />
				{/* Extra Curricular */}
				<GenericListEditor title="Extra Curricular Activities" items={data.extras} setItems={setExtras} styleKey="extras" placeholder="Activity" />
				<div className="text-xs text-gray-500 mt-2">Tip: Use short lines to keep the resume on one page. Reduce font size in PDF styles if needed.</div>
			</div>
			{/* Preview & Download */}
			<div className="w-1/2 flex flex-col gap-3">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-bold">Preview</h2>
					<PDFDownloadLink document={<ResumePDF data={data} listStyles={listStyles} template={template} />} fileName="Biswajit_Sharma_resume.pdf">
						{({ loading }) =>
							loading ? (
								<button className="bg-gray-300 px-3 py-1 rounded">Preparing...</button>
							) : (
								<button className="bg-green-600 text-white px-3 py-1 rounded">⬇️ Download PDF</button>
							)
						}
					</PDFDownloadLink>
				</div>
				<div className="flex-1 border rounded overflow-hidden">
					<PDFViewer style={{ width: "100%", height: "100%" }}>
						<ResumePDF data={data} listStyles={listStyles} template={template} />
					</PDFViewer>
				</div>
			</div>
		</div>
	);
}
