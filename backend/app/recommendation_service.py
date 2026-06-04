import logging

logger = logging.getLogger("trustcart_recommendation_service")

class RecommendationService:
    """
    Service responsible for suggesting action plans to minimize returns
    and increase product trust based on the identified return reason.
    """

    # Static mapping from return reasons to specific actions.
    RECOMMENDATION_MAP = {
        "Size Issue": "Improve size chart, add model height/weight reference, and collect size feedback.",
        "Quality Issue": "Improve supplier quality checks and add clear product material details.",
        "Damaged Product": "Improve packaging and add pre-shipping quality inspection.",
        "Wrong Product": "Improve warehouse scanning and product verification before dispatch.",
        "Late Delivery": "Use faster delivery partners and show realistic delivery dates.",
        "Misleading Image": "Upload real product photos and mention exact color, size, and material.",
        "No Issue": "Product looks stable. Continue monitoring reviews and return rate."
    }

    @classmethod
    def get_recommendation(cls, return_reason: str) -> str:
        """
        Retrieves the refund-reduction and action plan recommendation for a given return reason.
        Handles casing variations or spacing issues gracefully.
        """
        if not return_reason:
            return cls.RECOMMENDATION_MAP["No Issue"]

        # Clean input for comparison (strip whitespace)
        cleaned_reason = return_reason.strip()

        # Check direct match
        if cleaned_reason in cls.RECOMMENDATION_MAP:
            return cls.RECOMMENDATION_MAP[cleaned_reason]

        # Case-insensitive check
        for key, rec in cls.RECOMMENDATION_MAP.items():
            if key.lower() == cleaned_reason.lower():
                return rec

        # Fallback for unrecognized issues: output a general warning
        logger.warning(f"Unrecognized return reason: '{return_reason}'. Using general fallback recommendation.")
        return (
            "Monitor product reviews closely for specific issues. Conduct random inventory audits "
            "to ensure quality standards are met."
        )

# Global instance
recommendation_service = RecommendationService()
