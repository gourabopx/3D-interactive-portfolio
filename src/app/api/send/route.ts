import { EmailTemplate } from "@/components/email-template";
import { config } from "@/data/config";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const Email = z.object({
  fullName: z.string().min(2, "Full name is invalid!"),
  email: z.string().email({ message: "Email is invalid!" }),
  message: z.string().min(10, "Message is too short!"),
});

export async function POST(req: Request) {
  try {
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return Response.json({ error: "Email service not configured" }, { status: 500 });
    }

    const body = await req.json();
    console.log("Received contact form submission:", { 
      fullName: body.fullName, 
      email: body.email,
      messageLength: body.message?.length 
    });

    const {
      success: zodSuccess,
      data: zodData,
      error: zodError,
    } = Email.safeParse(body);
    
    if (!zodSuccess) {
      console.error("Validation error:", zodError);
      return Response.json({ error: zodError?.issues || "Validation failed" }, { status: 400 });
    }

    console.log("Attempting to send email to:", config.email);

    const { data: resendData, error: resendError } = await resend.emails.send({
      from: "Portfolio Contact <noreply@resend.dev>", // Using verified Resend domain
      to: [config.email],
      subject: `New Contact from ${zodData.fullName} - Portfolio`,
      react: EmailTemplate({
        fullName: zodData.fullName,
        email: zodData.email,
        message: zodData.message,
      }),
      // Add text fallback
      text: `New contact from: ${zodData.fullName} (${zodData.email})\n\nMessage: ${zodData.message}`,
    });

    if (resendError) {
      console.error("Resend API error:", resendError);
      return Response.json({ error: "Failed to send email", details: resendError }, { status: 500 });
    }

    console.log("Email sent successfully:", resendData);
    return Response.json({ success: true, id: resendData?.id });
  } catch (error) {
    console.error("Unexpected error:", error);
    return Response.json({ error: "Internal server error", details: error }, { status: 500 });
  }
}
