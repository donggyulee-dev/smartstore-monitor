import axios from "axios";

type SlackPayload = {
    text: string;
};

export async function sendSlackMessage(message: string, webhookUrl?: string) {
    const url = webhookUrl || process.env.WEBHOOK_LOG;

    if (!url) {
        console.error("[slack] Webhook URL이 설정되지 않았습니다.");
        return;
    }

    const payload: SlackPayload = {
        text: message,
    };

    try {
        const res = await axios.post(url, payload, {
            headers: { "Content-Type": "application/json" },
        });

        console.log("[slack] 메시지 전송 성공:", message.slice(0, 30));
        return res.data;
    } catch (error: any) {
        console.error("[slack] 메시지 전송 실패:", {
            message: error.message,
            status: error.response?.status,
            response: error.response?.data,
        });
    }
}
