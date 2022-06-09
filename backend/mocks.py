from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .mockLookupValues import mockLookupValues


class MockLookupValues(APIView):
	def get(self, request, format=None):
		mocking_successful = mockLookupValues()
		if mocking_successful:
			return Response({'success': mocking_successful},
							status=status.HTTP_200_OK)
		else:
			return Response({'success': mocking_successful},
							status=status.HTTP_409_CONFLICT)
