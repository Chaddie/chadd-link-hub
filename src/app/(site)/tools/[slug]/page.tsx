import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AutopilotDecoder } from "@/components/tools/AutopilotDecoder";
import { Base64FileConverter } from "@/components/tools/Base64FileConverter";
import { DnsLookupTool } from "@/components/tools/DnsLookupTool";
import { EmailHeaderAnalyser } from "@/components/tools/EmailHeaderAnalyser";
import { HttpStatusCodes } from "@/components/tools/HttpStatusCodes";
import { ImperialMetricConverter } from "@/components/tools/ImperialMetricConverter";
import { IpGeolocation } from "@/components/tools/IpGeolocation";
import { MacAddressLookup } from "@/components/tools/MacAddressLookup";
import { MimeConverter } from "@/components/tools/MimeConverter";
import { PasswordGenerator } from "@/components/tools/PasswordGenerator";
import { PortReference } from "@/components/tools/PortReference";
import { QrCodeGenerator } from "@/components/tools/QrCodeGenerator";
import { RegexTester } from "@/components/tools/RegexTester";
import { ReverseDns } from "@/components/tools/ReverseDns";
import { SpfGenerator } from "@/components/tools/SpfGenerator";
import { SslChecker } from "@/components/tools/SslChecker";
import { SubnetCalculator } from "@/components/tools/SubnetCalculator";
import { YamlJsonConverter } from "@/components/tools/YamlJsonConverter";
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
  "spf-generator": <SpfGenerator />,
  "base64-file-converter": <Base64FileConverter />,
  "yaml-json-converter": <YamlJsonConverter />,
  "regex-tester": <RegexTester />,
  "mime-converter": <MimeConverter />,
  "qr-code-generator": <QrCodeGenerator />,
  "mac-address-lookup": <MacAddressLookup />,
  "imperial-metric-converter": <ImperialMetricConverter />,
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
