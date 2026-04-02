import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AutopilotDecoder } from "@/components/tools/AutopilotDecoder";
import { DnsLookupTool } from "@/components/tools/DnsLookupTool";
import { EmailHeaderAnalyser } from "@/components/tools/EmailHeaderAnalyser";
import { HttpStatusCodes } from "@/components/tools/HttpStatusCodes";
import { IpGeolocation } from "@/components/tools/IpGeolocation";
import { PasswordGenerator } from "@/components/tools/PasswordGenerator";
import { PortReference } from "@/components/tools/PortReference";
import { ReverseDns } from "@/components/tools/ReverseDns";
import { SslChecker } from "@/components/tools/SslChecker";
import { SubnetCalculator } from "@/components/tools/SubnetCalculator";
import { getTool, resolveToolSlug, TOOLS } from "@/lib/tools-registry";

const TOOL_UI: Record<string, React.ReactNode> = {
  "subnet-calculator": <SubnetCalculator />,
  "password-generator": <PasswordGenerator />,
  "port-reference": <PortReference />,
  "ip-geolocation": <IpGeolocation />,
  "ssl-checker": <SslChecker />,
  "email-header-analyser": <EmailHeaderAnalyser />,
  "dns-lookup": <DnsLookupTool />,
  "http-status-codes": <HttpStatusCodes />,
  "reverse-dns": <ReverseDns />,
  "autopilot-hash-decoder": <AutopilotDecoder />,
};

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resolved = resolveToolSlug(slug);
  const tool = resolved ? getTool(resolved) : undefined;
  if (!tool) return { title: "Tool" };
  return {
    title: `${tool.title} — IT Tools`,
    description: tool.description,
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const resolved = resolveToolSlug(slug);
  if (!resolved) notFound();
  const ui = TOOL_UI[resolved];
  if (!ui) notFound();
  return ui;
}
