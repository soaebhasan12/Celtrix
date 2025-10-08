from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import ExampleModel
from .serializers import ExampleModelSerializer


@api_view(['GET'])
def health_check(request):
    """
    Health check endpoint to verify API is running
    """
    return Response({
        'status': 'success',
        'message': 'Django API is running!'
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def hello_world(request):
    """
    Simple hello world endpoint
    """
    return Response({
        'message': 'Hello from Django API!',
        'version': '1.0.0'
    }, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
def example_list(request):
    """
    List all examples or create a new example
    """
    if request.method == 'GET':
        examples = ExampleModel.objects.all()
        serializer = ExampleModelSerializer(examples, many=True)
        return Response({
            'status': 'success',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        serializer = ExampleModelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 'success',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'status': 'error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def example_detail(request, pk):
    """
    Retrieve, update or delete an example
    """
    try:
        example = ExampleModel.objects.get(pk=pk)
    except ExampleModel.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Example not found'
        }, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ExampleModelSerializer(example)
        return Response({
            'status': 'success',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        serializer = ExampleModelSerializer(example, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 'success',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            'status': 'error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        example.delete()
        return Response({
            'status': 'success',
            'message': 'Example deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)