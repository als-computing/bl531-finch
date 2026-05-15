import GoogleDoc from "@/components/GoogleDoc"
export default function GoogleDocsPage() {
    const docs = [
        {
            title: "BL531 New Feature Request Documentation",
            url: "https://docs.google.com/document/d/1jkQqJ02L4R1XjVZmKGtJfWkn2fQVBQJihL1Oy9Dxhug/edit?usp=sharing"
        },
        {
            title: "BL531 Beamline Info",
            url: "https://docs.google.com/document/d/1NdNRfb5KFtb9-DfPl6uxdFJjL7nxJCpxRZIYmLI9LtI/edit?usp=sharing"
        },
        {
            title: "Osprey Dev Journal",
            url: "https://docs.google.com/document/d/1soFen_iFWRMSywI7tWfCG2DWKm7vzVa_rUjBwjWfiZE/edit?usp=sharing"
        }
    ];
    return (
        <GoogleDoc docs={docs} />
    )
}