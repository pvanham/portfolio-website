/** /projects — permanent redirect to the homepage projects section. */

import { permanentRedirect } from "next/navigation";

export default function ProjectsPage() {
  permanentRedirect("/#projects");
}
